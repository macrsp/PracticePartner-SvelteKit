/**
 * @role ci-helper-script
 * @owns generation and synchronization of the pull-request architecture summary section
 * @not-owns CI validation, branch protection, or architecture source-of-truth content
 * @notes Uses base-branch workflow logic and architecture metadata to update only the auto-generated PR body section.
 */

import fs from 'node:fs';
import path from 'node:path';
import { inferFocusElement, loadElements } from '../architecture/lib.mjs';

class PullRequestBodySyncError extends Error {
	constructor(message) {
		super(message);
		this.name = 'PullRequestBodySyncError';
	}
}

const AUTO_START = '<!-- architecture:auto:start -->';
const AUTO_END = '<!-- architecture:auto:end -->';

const args = parseArgs(process.argv.slice(2));

main().catch((error) => {
	if (error instanceof PullRequestBodySyncError) {
		console.error(`PR body sync failed: ${error.message}`);
		process.exit(1);
	}

	console.error(error);
	process.exit(1);
});

async function main() {
	const repo = args.repo;
	const pullNumber = Number(args['pull-number']);
	const branchName = args.branch;
	const token = process.env.GITHUB_TOKEN;

	if (!repo) {
		throw new PullRequestBodySyncError('Missing required --repo argument.');
	}

	if (!Number.isInteger(pullNumber) || pullNumber <= 0) {
		throw new PullRequestBodySyncError('Missing or invalid --pull-number argument.');
	}

	if (!branchName) {
		throw new PullRequestBodySyncError('Missing required --branch argument.');
	}

	if (!token) {
		throw new PullRequestBodySyncError('GITHUB_TOKEN is required.');
	}

	const [owner, repoName] = repo.split('/');

	if (!owner || !repoName) {
		throw new PullRequestBodySyncError(`Invalid repo value "${repo}". Expected "owner/repo".`);
	}

	const { settings, elements } = loadElements();
	const focusResult = inferFocusElement(branchName, elements, settings.defaultFocusElement);
	const changedFiles = await listPullRequestFiles({ owner, repoName, pullNumber, token });

	const summary = buildArchitectureSummary({
		branchName,
		changedFiles,
		elements,
		focusResult
	});

	const pullRequest = await getPullRequest({ owner, repoName, pullNumber, token });
	const templateBody = readPullRequestTemplate();
	const startingBody = pullRequest.body?.trim() ? pullRequest.body : templateBody;
	const nextBody = upsertAutoSection(startingBody, summary);

	if (nextBody === (pullRequest.body ?? '')) {
		console.log(`PR #${pullNumber} body is already up to date.`);
		return;
	}

	await updatePullRequestBody({
		owner,
		repoName,
		pullNumber,
		token,
		body: nextBody
	});

	console.log(`Updated PR #${pullNumber} body.`);
}

function parseArgs(argv) {
	const parsed = {};

	for (let index = 0; index < argv.length; index += 1) {
		const token = argv[index];

		if (!token.startsWith('--')) {
			throw new PullRequestBodySyncError(`Unknown argument "${token}".`);
		}

		const key = token.slice(2);
		const value = argv[index + 1];

		if (!value || value.startsWith('--')) {
			throw new PullRequestBodySyncError(`Missing value for argument "${token}".`);
		}

		parsed[key] = value;
		index += 1;
	}

	return parsed;
}

function readPullRequestTemplate() {
	const templatePath = path.join(process.cwd(), '.github', 'PULL_REQUEST_TEMPLATE.md');

	if (!fs.existsSync(templatePath)) {
		return `${AUTO_START}\n_Auto-generated architecture context will be inserted here._\n${AUTO_END}\n`;
	}

	return fs.readFileSync(templatePath, 'utf8');
}

function buildArchitectureSummary({ branchName, changedFiles, elements, focusResult }) {
	const changedArchitectureElementIds = new Set();
	const impactedElementIds = new Set();
	const fileMappings = [];

	const elementsById = new Map(elements.map((element) => [element.id, element]));

	for (const changedFile of changedFiles) {
		const matchedElementIds = new Set();

		for (const element of elements) {
			if (changedFile === element.path) {
				changedArchitectureElementIds.add(element.id);
				matchedElementIds.add(element.id);
				impactedElementIds.add(element.id);
				continue;
			}

			for (const codePath of element.code_paths ?? []) {
				if (matchesPattern(changedFile, codePath)) {
					matchedElementIds.add(element.id);
					impactedElementIds.add(element.id);
				}
			}
		}

		if (matchedElementIds.size > 0) {
			fileMappings.push({
				file: changedFile,
				elementIds: [...matchedElementIds].sort()
			});
		}
	}

	if (impactedElementIds.size === 0) {
		impactedElementIds.add(focusResult.element.id);
	}

	const impactedElements = [...impactedElementIds]
		.map((id) => elementsById.get(id))
		.filter(Boolean)
		.sort(compareElements);

	const changedArchitectureElements = [...changedArchitectureElementIds]
		.map((id) => elementsById.get(id))
		.filter(Boolean)
		.sort(compareElements);

	const collaboratorIds = new Set();
	for (const element of impactedElements) {
		for (const collaboratorId of element.collaborators ?? []) {
			collaboratorIds.add(collaboratorId);
		}
	}

	const collaborators = [...collaboratorIds]
		.map((id) => elementsById.get(id))
		.filter(Boolean)
		.sort(compareElements);

	const lines = [
		'### Auto-generated architecture summary',
		'',
		`- Branch: \`${branchName}\``,
		focusResult.usedDefault
			? `- Focus element: \`${focusResult.element.id}\` (default fallback)`
			: `- Focus element: \`${focusResult.element.id}\` (matched alias \`${focusResult.matchedAlias}\`)`
	];

	lines.push('', '### Changed architecture element files');

	if (changedArchitectureElements.length === 0) {
		lines.push('- None');
	} else {
		for (const element of changedArchitectureElements) {
			lines.push(`- \`${element.id}\``);
		}
	}

	lines.push('', '### Additional impacted elements');

	for (const element of impactedElements) {
		lines.push(`- \`${element.id}\``);
	}

	lines.push('', '### Collaborators to review');

	if (collaborators.length === 0) {
		lines.push('- None');
	} else {
		for (const element of collaborators) {
			lines.push(`- \`${element.id}\``);
		}
	}

	lines.push('', '### Changed file mapping');

	if (fileMappings.length === 0) {
		lines.push('- No changed files matched declared architecture ownership hints.');
	} else {
		for (const mapping of fileMappings.sort((left, right) => left.file.localeCompare(right.file))) {
			lines.push(`- \`${mapping.file}\` → ${mapping.elementIds.map((id) => `\`${id}\``).join(', ')}`);
		}
	}

	return lines.join('\n');
}

function compareElements(left, right) {
	return Number(left.order ?? 0) - Number(right.order ?? 0) || left.id.localeCompare(right.id);
}

function matchesPattern(filePath, pattern) {
	const regex = globToRegExp(pattern);
	return regex.test(filePath);
}

function globToRegExp(pattern) {
	let regex = '^';
	let index = 0;

	while (index < pattern.length) {
		const char = pattern[index];
		const nextChar = pattern[index + 1];

		if (char === '*' && nextChar === '*') {
			regex += '.*';
			index += 2;
			continue;
		}

		if (char === '*') {
			regex += '[^/]*';
			index += 1;
			continue;
		}

		if ('\\.[]{}()+-?^$|'.includes(char)) {
			regex += `\\${char}`;
			index += 1;
			continue;
		}

		regex += char;
		index += 1;
	}

	regex += '$';
	return new RegExp(regex);
}

function upsertAutoSection(body, autoSection) {
	const normalizedBody = body?.trim() ? body : `${AUTO_START}\n${AUTO_END}`;
	const block = `${AUTO_START}\n${autoSection}\n${AUTO_END}`;

	if (normalizedBody.includes(AUTO_START) && normalizedBody.includes(AUTO_END)) {
		const pattern = new RegExp(`${escapeRegExp(AUTO_START)}[\\s\\S]*?${escapeRegExp(AUTO_END)}`, 'm');
		return normalizedBody.replace(pattern, block);
	}

	return `${normalizedBody.trim()}\n\n${block}\n`;
}

function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function getPullRequest({ owner, repoName, pullNumber, token }) {
	return githubApiRequest({
		method: 'GET',
		path: `/repos/${owner}/${repoName}/pulls/${pullNumber}`,
		token
	});
}

async function listPullRequestFiles({ owner, repoName, pullNumber, token }) {
	const files = [];
	let page = 1;

	while (true) {
		const response = await githubApiRequest({
			method: 'GET',
			path: `/repos/${owner}/${repoName}/pulls/${pullNumber}/files?per_page=100&page=${page}`,
			token
		});

		if (!Array.isArray(response) || response.length === 0) {
			break;
		}

		for (const file of response) {
			if (file.filename) {
				files.push(file.filename);
			}
		}

		if (response.length < 100) {
			break;
		}

		page += 1;
	}

	return files;
}

async function updatePullRequestBody({ owner, repoName, pullNumber, token, body }) {
	await githubApiRequest({
		method: 'PATCH',
		path: `/repos/${owner}/${repoName}/pulls/${pullNumber}`,
		token,
		body: { body }
	});
}

async function githubApiRequest({ method, path, token, body }) {
	const response = await fetch(`https://api.github.com${path}`, {
		method,
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28',
			'User-Agent': 'practicepartner-sveltekit-pr-context',
			...(body ? { 'Content-Type': 'application/json' } : {})
		},
		...(body ? { body: JSON.stringify(body) } : {})
	});

	if (!response.ok) {
		const text = await response.text();
		throw new PullRequestBodySyncError(
			`GitHub API request failed for ${path} with status ${response.status}: ${text}`
		);
	}

	if (response.status === 204) {
		return null;
	}

	return response.json();
}