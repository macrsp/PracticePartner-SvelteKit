import { execSync } from 'node:child_process';
import path from 'node:path';
import { inferFocusElement, loadElements } from './lib.mjs';

class ValidationError extends Error {
	constructor(message) {
		super(message);
		this.name = 'ValidationError';
	}
}

const branchFlagIndex = process.argv.indexOf('--branch');
const branchName = branchFlagIndex >= 0 ? process.argv[branchFlagIndex + 1] : process.env.BRANCH_NAME;
const requireFocusUpdate = process.argv.includes('--require-focus-update');

try {
	main();
} catch (error) {
	if (error instanceof ValidationError) {
		console.error(`Architecture validation failed: ${error.message}`);
		process.exit(1);
	}

	console.error(error);
	process.exit(1);
}

function main() {
	const { settings, elements } = loadElements();

	const ids = new Set();
	const aliases = new Map();

	for (const element of elements) {
		if (ids.has(element.id)) {
			throw new ValidationError(`Duplicate architectural element id: ${element.id}`);
		}

		ids.add(element.id);

		for (const collaboratorId of element.collaborators ?? []) {
			if (!elements.some((candidate) => candidate.id === collaboratorId)) {
				throw new ValidationError(
					`Unknown collaborator "${collaboratorId}" referenced by "${element.id}".`
				);
			}
		}

		for (const alias of element.branch_aliases ?? []) {
			const normalizedAlias = alias.toLowerCase();

			if (aliases.has(normalizedAlias)) {
				throw new ValidationError(
					`Duplicate branch alias "${alias}" used by "${element.id}" and "${aliases.get(normalizedAlias)}".`
				);
			}

			aliases.set(normalizedAlias, element.id);
		}
	}

	const focusResult = inferFocusElement(branchName, elements, settings.defaultFocusElement);
	const focusElement = focusResult.element;

	if (requireFocusUpdate) {
		const changedFiles = getChangedFiles();
		const ignoredPrefixes = [
			'repo-context.xml',
			'ci-context.xml',
			'architecture/target-architecture.md',
			'architecture/contexts/',
			'architecture/context-manifests/',
			'.tmp/'
		];

		const meaningfulChangedFiles = changedFiles.filter(
			(filePath) => !ignoredPrefixes.some((prefix) => filePath === prefix || filePath.startsWith(prefix))
		);

		if (meaningfulChangedFiles.length > 0) {
			if (!focusResult.usedDefault && !meaningfulChangedFiles.includes(focusElement.path)) {
				throw new ValidationError(
					`The focus element file "${focusElement.path}" must be updated as part of this branch before code changes land.`
				);
			}

			if (focusResult.usedDefault) {
				console.warn(
					`[architecture validation] Branch "${branchName}" is using the default focus element "${focusElement.id}". ` +
						'A focus-element file update is not required for default-fallback branches.'
				);
			}
		}
	}

	if (focusResult.usedDefault) {
		console.warn(
			`[architecture validation] Branch "${branchName}" did not match any architectural element alias. ` +
				`Falling back to default focus element "${focusElement.id}".`
		);
	}

	console.log(
		focusResult.usedDefault
			? `Architecture metadata is consistent. Focus element: ${focusElement.id} (default fallback).`
			: `Architecture metadata is consistent. Focus element: ${focusElement.id} (matched alias "${focusResult.matchedAlias}").`
	);
}

function getChangedFiles() {
	const baseRef = process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : 'origin/main';

	try {
		execSync(`git rev-parse --verify ${baseRef}`, { stdio: 'ignore' });
	} catch {
		console.warn(
			`[architecture validation] Base ref "${baseRef}" is not available in this checkout. Skipping changed-file enforcement.`
		);
		return [];
	}

	const diffRange = resolveDiffRange(baseRef);

	let diffOutput = '';

	try {
		diffOutput = execSync(`git diff --name-only ${diffRange}`, { encoding: 'utf8' }).trim();
	} catch {
		throw new ValidationError(
			`Could not determine changed files against "${baseRef}". Ensure CI has sufficient git history for validation.`
		);
	}

	if (!diffOutput) {
		return [];
	}

	return diffOutput
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean)
		.map((filePath) => path.normalize(filePath).replace(/\\/g, '/'));
}

function resolveDiffRange(baseRef) {
	try {
		const mergeBase = execSync(`git merge-base HEAD ${baseRef}`, { encoding: 'utf8' }).trim();

		if (mergeBase) {
			return `${mergeBase}..HEAD`;
		}
	} catch {
		console.warn(
			`[architecture validation] Could not compute merge-base with "${baseRef}". Falling back to direct diff "${baseRef}..HEAD".`
		);
		return `${baseRef}..HEAD`;
	}

	throw new ValidationError(`Could not resolve a usable diff base from "${baseRef}".`);
}