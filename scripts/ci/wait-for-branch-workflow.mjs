/**
 * @role ci-helper-script
 * @owns waiting for a branch-scoped workflow to settle and detecting whether the branch advanced while waiting
 * @not-owns build validation, architecture generation, or artifact freshness checks themselves
 * @notes Expected operational failures return concise messages with exit code 1 rather than stack traces.
 */

import fs from 'node:fs';

class WorkflowWaitError extends Error {
	constructor(message) {
		super(message);
		this.name = 'WorkflowWaitError';
	}
}

const args = parseArgs(process.argv.slice(2));

main().catch((error) => {
	if (error instanceof WorkflowWaitError) {
		console.error(`Workflow wait failed: ${error.message}`);
		process.exit(1);
	}

	console.error(error);
	process.exit(1);
});

async function main() {
	const repo = args.repo;
	const branch = args.branch;
	const workflowPath = args['workflow-path'];
	const currentHeadSha = args['current-head-sha'];
	const timeoutSeconds = Number(args['timeout-seconds'] ?? 900);
	const pollSeconds = Number(args['poll-seconds'] ?? 10);
	const token = process.env.GITHUB_TOKEN;

	if (!repo) {
		throw new WorkflowWaitError('Missing required --repo argument.');
	}

	if (!branch) {
		throw new WorkflowWaitError('Missing required --branch argument.');
	}

	if (!workflowPath) {
		throw new WorkflowWaitError('Missing required --workflow-path argument.');
	}

	if (!currentHeadSha) {
		throw new WorkflowWaitError('Missing required --current-head-sha argument.');
	}

	if (!token) {
		throw new WorkflowWaitError('GITHUB_TOKEN is required.');
	}

	const [owner, repoName] = repo.split('/');

	if (!owner || !repoName) {
		throw new WorkflowWaitError(`Invalid repo value "${repo}". Expected "owner/repo".`);
	}

	const workflow = await findWorkflowByPath({
		owner,
		repoName,
		workflowPath,
		token
	});

	if (!workflow) {
		throw new WorkflowWaitError(`Could not find workflow at path "${workflowPath}".`);
	}

	const deadline = Date.now() + timeoutSeconds * 1000;
	let hasWaited = false;

	while (true) {
		const activeRuns = await listActiveWorkflowRuns({
			owner,
			repoName,
			workflowId: workflow.id,
			branch,
			token
		});

		if (activeRuns.length === 0) {
			break;
		}

		hasWaited = true;
		console.log(
			`Waiting for ${activeRuns.length} "${workflow.name}" run(s) on branch "${branch}" to complete...`
		);

		if (Date.now() >= deadline) {
			throw new WorkflowWaitError(
				`Timed out waiting for workflow "${workflow.name}" on branch "${branch}" to settle.`
			);
		}

		await sleep(pollSeconds * 1000);
	}

	const latestHeadSha = await getBranchHeadSha({
		owner,
		repoName,
		branch,
		token
	});

	const superseded = latestHeadSha !== currentHeadSha;

	writeOutput('superseded', superseded ? 'true' : 'false');
	writeOutput('latest_head_sha', latestHeadSha);
	writeOutput('waited', hasWaited ? 'true' : 'false');

	if (superseded) {
		console.log(
			`Branch head advanced from ${currentHeadSha} to ${latestHeadSha} while waiting for generated artifacts.`
		);
	} else if (hasWaited) {
		console.log(`Workflow runs settled and branch head remained at ${currentHeadSha}.`);
	} else {
		console.log(`No active "${workflow.name}" runs were found for branch "${branch}".`);
	}
}

function parseArgs(argv) {
	const parsed = {};

	for (let index = 0; index < argv.length; index += 1) {
		const token = argv[index];

		if (!token.startsWith('--')) {
			throw new WorkflowWaitError(`Unknown argument "${token}".`);
		}

		const key = token.slice(2);
		const value = argv[index + 1];

		if (!value || value.startsWith('--')) {
			throw new WorkflowWaitError(`Missing value for argument "${token}".`);
		}

		parsed[key] = value;
		index += 1;
	}

	return parsed;
}

async function findWorkflowByPath({ owner, repoName, workflowPath, token }) {
	const response = await githubApiRequest({
		path: `/repos/${owner}/${repoName}/actions/workflows?per_page=100`,
		token
	});

	return response.workflows?.find((workflow) => workflow.path === workflowPath) ?? null;
}

async function listActiveWorkflowRuns({ owner, repoName, workflowId, branch, token }) {
	const response = await githubApiRequest({
		path: `/repos/${owner}/${repoName}/actions/workflows/${workflowId}/runs?branch=${encodeURIComponent(branch)}&event=push&per_page=100`,
		token
	});

	return (response.workflow_runs ?? []).filter((run) => run.status !== 'completed');
}

async function getBranchHeadSha({ owner, repoName, branch, token }) {
	const response = await githubApiRequest({
		path: `/repos/${owner}/${repoName}/branches/${encodeURIComponent(branch)}`,
		token
	});

	const sha = response.commit?.sha;

	if (!sha) {
		throw new WorkflowWaitError(`Could not resolve latest head SHA for branch "${branch}".`);
	}

	return sha;
}

async function githubApiRequest({ path, token }) {
	const response = await fetch(`https://api.github.com${path}`, {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28',
			'User-Agent': 'practicepartner-sveltekit-ci'
		}
	});

	if (!response.ok) {
		const text = await response.text();
		throw new WorkflowWaitError(
			`GitHub API request failed for ${path} with status ${response.status}: ${text}`
		);
	}

	return await response.json();
}

function writeOutput(name, value) {
	const outputPath = process.env.GITHUB_OUTPUT;

	if (!outputPath) {
		return;
	}

	fs.appendFileSync(outputPath, `${name}=${value}\n`, 'utf8');
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}