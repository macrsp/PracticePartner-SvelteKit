import { execSync } from 'node:child_process';
import path from 'node:path';
import { inferFocusElement, loadElements } from './lib.mjs';

const branchFlagIndex = process.argv.indexOf('--branch');
const branchName = branchFlagIndex >= 0 ? process.argv[branchFlagIndex + 1] : process.env.BRANCH_NAME;
const requireFocusUpdate = process.argv.includes('--require-focus-update');
const { settings, elements } = loadElements();

const ids = new Set();
const aliases = new Map();

for (const element of elements) {
	if (ids.has(element.id)) {
		throw new Error(`Duplicate architectural element id: ${element.id}`);
	}

	ids.add(element.id);

	for (const collaboratorId of element.collaborators ?? []) {
		if (!elements.some((candidate) => candidate.id === collaboratorId)) {
			throw new Error(`Unknown collaborator "${collaboratorId}" referenced by "${element.id}".`);
		}
	}

	for (const alias of element.branch_aliases ?? []) {
		const normalizedAlias = alias.toLowerCase();

		if (aliases.has(normalizedAlias)) {
			throw new Error(
				`Duplicate branch alias "${alias}" used by "${element.id}" and "${aliases.get(normalizedAlias)}".`
			);
		}

		aliases.set(normalizedAlias, element.id);
	}
}

const focusElement = inferFocusElement(branchName, elements, settings.defaultFocusElement);

if (!focusElement) {
	throw new Error(
		`Could not infer a focus architectural element from branch "${branchName}". ` +
			`Each non-main branch must include a configured architectural element alias.`
	);
}

if (requireFocusUpdate) {
	const changedFiles = getChangedFiles();
	const ignoredPrefixes = ['repo-context.xml', 'architecture/target-architecture.md', 'architecture/contexts/', '.tmp/'];

	const meaningfulChangedFiles = changedFiles.filter(
		(filePath) => !ignoredPrefixes.some((prefix) => filePath === prefix || filePath.startsWith(prefix))
	);

	if (meaningfulChangedFiles.length > 0 && !meaningfulChangedFiles.includes(focusElement.path)) {
		throw new Error(
			`The focus element file "${focusElement.path}" must be updated as part of this branch before code changes land.`
		);
	}
}

console.log(`Architecture metadata is consistent. Focus element: ${focusElement.id}`);

function getChangedFiles() {
	const baseRef = process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : 'origin/main';

	try {
		execSync(`git rev-parse --verify ${baseRef}`, { stdio: 'ignore' });
	} catch {
		return [];
	}

	const mergeBase = execSync(`git merge-base HEAD ${baseRef}`, { encoding: 'utf8' }).trim();
	const diffOutput = execSync(`git diff --name-only ${mergeBase}...HEAD`, { encoding: 'utf8' }).trim();

	if (!diffOutput) {
		return [];
	}

	return diffOutput
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean)
		.map((filePath) => path.normalize(filePath).replace(/\\/g, '/'));
}