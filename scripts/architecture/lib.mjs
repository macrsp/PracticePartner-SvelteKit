import fs from 'node:fs';
import path from 'node:path';

export function getRepoRoot() {
	return process.cwd();
}

export function loadJson(relativePath) {
	const absolutePath = path.join(getRepoRoot(), relativePath);
	return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
}

export function ensureDir(relativePath) {
	const absolutePath = path.join(getRepoRoot(), relativePath);
	fs.mkdirSync(absolutePath, { recursive: true });
}

export function writeText(relativePath, content) {
	const absolutePath = path.join(getRepoRoot(), relativePath);
	ensureDir(path.dirname(relativePath));
	fs.writeFileSync(absolutePath, content, 'utf8');
}

export function readText(relativePath) {
	return fs.readFileSync(path.join(getRepoRoot(), relativePath), 'utf8');
}

export function stripCommentHeader(markdown) {
	return markdown.replace(/^<!--[\s\S]*?-->\s*/m, '').trim();
}

export function parseFrontmatter(markdown) {
	if (!markdown.startsWith('---\n')) {
		return { data: {}, body: markdown.trim() };
	}

	const closingIndex = markdown.indexOf('\n---\n', 4);

	if (closingIndex === -1) {
		throw new Error('Invalid frontmatter block.');
	}

	const rawFrontmatter = markdown.slice(4, closingIndex).trim();
	const body = markdown.slice(closingIndex + 5).trim();
	const data = {};
	let currentArrayKey = null;

	for (const rawLine of rawFrontmatter.split('\n')) {
		const line = rawLine.replace(/\r/g, '');

		if (!line.trim()) {
			continue;
		}

		const keyMatch = /^([a-z_]+):\s*(.*)$/.exec(line);

		if (keyMatch) {
			const [, key, value] = keyMatch;

			if (!value) {
				data[key] = [];
				currentArrayKey = key;
				continue;
			}

			currentArrayKey = null;
			data[key] = /^\d+$/.test(value) ? Number(value) : value;
			continue;
		}

		const arrayMatch = /^\s*-\s*(.+)$/.exec(line);

		if (arrayMatch && currentArrayKey) {
			data[currentArrayKey].push(arrayMatch[1]);
			continue;
		}

		throw new Error(`Unsupported frontmatter line: ${line}`);
	}

	return { data, body };
}

export function loadElements() {
	const settings = loadJson('architecture/context-settings.json');
	const elementsDir = path.join(getRepoRoot(), settings.elementsDir);

	const elements = fs
		.readdirSync(elementsDir)
		.filter((entry) => entry.endsWith('.md'))
		.map((entry) => {
			const relativePath = path.join(settings.elementsDir, entry).replace(/\\/g, '/');
			const markdown = readText(relativePath);
			const { data, body } = parseFrontmatter(markdown);

			if (!data.id || !data.title) {
				throw new Error(`Element file ${relativePath} is missing required metadata.`);
			}

			return {
				...data,
				path: relativePath,
				body: body.trim()
			};
		})
		.sort((left, right) => {
			const orderDelta = Number(left.order ?? 0) - Number(right.order ?? 0);
			return orderDelta || String(left.title).localeCompare(String(right.title));
		});

	return { settings, elements };
}

export function inferFocusElement(branchName, elements, defaultElementId) {
	const normalizedBranchName = String(branchName || '').toLowerCase();
	const defaultElement = elements.find((element) => element.id === defaultElementId) ?? null;

	if (!defaultElement) {
		throw new Error(`Default focus architectural element "${defaultElementId}" was not found.`);
	}

	if (!normalizedBranchName || normalizedBranchName === 'main') {
		return {
			element: defaultElement,
			matchedAlias: null,
			usedDefault: true
		};
	}

	const matches = [];

	for (const element of elements) {
		for (const alias of element.branch_aliases ?? []) {
			const normalizedAlias = String(alias).toLowerCase();

			if (normalizedAlias && normalizedBranchName.includes(normalizedAlias)) {
				matches.push({
					element,
					alias,
					score: normalizedAlias.length
				});
			}
		}
	}

	if (!matches.length) {
		return {
			element: defaultElement,
			matchedAlias: null,
			usedDefault: true
		};
	}

	matches.sort((left, right) => {
		return right.score - left.score || Number(left.element.order ?? 0) - Number(right.element.order ?? 0);
	});

	return {
		element: matches[0].element,
		matchedAlias: matches[0].alias,
		usedDefault: false
	};
}

export function collectElementContext(elementId, elements) {
	const byId = new Map(elements.map((element) => [element.id, element]));
	const focusElement = byId.get(elementId);

	if (!focusElement) {
		throw new Error(`Unknown element id: ${elementId}`);
	}

	const contextElements = [focusElement];

	for (const collaboratorId of focusElement.collaborators ?? []) {
		const collaborator = byId.get(collaboratorId);

		if (!collaborator) {
			throw new Error(`Unknown collaborator "${collaboratorId}" referenced by "${elementId}".`);
		}

		contextElements.push(collaborator);
	}

	const uniqueElements = [];
	const seen = new Set();

	for (const element of contextElements) {
		if (seen.has(element.id)) {
			continue;
		}

		seen.add(element.id);
		uniqueElements.push(element);
	}

	return uniqueElements;
}

export function collectUniqueCodePaths(elements) {
	const paths = new Set();

	for (const element of elements) {
		for (const codePath of element.code_paths ?? []) {
			paths.add(codePath);
		}
	}

	return [...paths];
}

export function buildRepomixConfig({ outputPath, include, headerText }) {
	return {
		$schema: 'https://repomix.com/schemas/latest/schema.json',
		output: {
			filePath: outputPath,
			style: 'xml',
			instructionFilePath: 'repomix-instruction.md',
			fileSummary: true,
			directoryStructure: true,
			files: true,
			removeComments: false,
			removeEmptyLines: false,
			includeEmptyDirectories: false,
			headerText,
			git: {
				sortByChanges: true,
				includeDiffs: false,
				includeLogs: false
			}
		},
		include,
		ignore: {
			useGitignore: true,
			useDefaultPatterns: true,
			customPatterns: ['build', '.svelte-kit', 'repo-context.xml', 'architecture/contexts', '.tmp']
		},
		security: {
			enableSecurityCheck: true
		},
		tokenCount: {
			encoding: 'o200k_base'
		}
	};
}