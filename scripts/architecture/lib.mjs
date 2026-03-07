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

export function stripLeadingHeading(markdown) {
	const normalized = stripCommentHeader(markdown);

	return normalized
		.replace(/^#{1,6}[^\n]*\n+/, '')
		.trim();
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
		.sort(compareElements);

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
		return right.score - left.score || compareElements(left.element, right.element);
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

export function getElementManifestPath(elementId, settings) {
	const suffix = settings.elementContextManifestSuffix ?? '.context-code-path-coverage.md';
	return normalizeRepoPath(path.join(settings.contextManifestDir, `${elementId}${suffix}`));
}

export function getRepoManifestPath(settings) {
	return normalizeRepoPath(
		path.join(settings.contextManifestDir, settings.repoContextManifestName ?? 'repo-code-path-coverage.md')
	);
}

export function buildContextCoverageManifest({ focusElement, contextElements }) {
	const relevantElements = [...contextElements].sort(compareElements);
	const rows = buildCoverageRows(relevantElements, focusElement.id);
	const roots = collectRelevantTreeRoots(relevantElements);
	const lines = [
		`# ${focusElement.title} Context Coverage Manifest`,
		'',
		'This generated manifest helps distinguish between code that is present in the repository and code paths that are declared architecturally but are still empty or missing.',
		'',
		'Use this manifest before assuming that a missing file in the packed context means the repository has no implementation for that area.',
		'',
		'## How to use this manifest',
		'',
		'- Start with the focus element rows, then inspect collaborator rows that the requested change depends on.',
		'- Treat `path missing` and `directory exists but empty` as signals that the architecture may be ahead of implementation or that the next step is first-time implementation.',
		'- Treat `no matches for glob` as a sign to clarify whether the declared ownership path is stale, overly broad, or simply not populated yet.',
		'- If the needed collaborator area is sparse or missing, clarify architectural intent before spreading implementation into adjacent undeclared areas.',
		'',
		'## Status meanings',
		'',
		'| Status | Meaning |',
		'| --- | --- |',
		'| `present` | One or more files matched the declared path. |',
		'| `directory exists but empty` | The owned directory exists, but it does not contain files yet. |',
		'| `path missing` | The declared file or directory root does not exist in the repository yet. |',
		'| `no matches for glob` | The root exists, but nothing currently matches the declared glob. |',
		'',
		'## Elements in this context',
		''
	];

	for (const element of relevantElements) {
		const role = element.id === focusElement.id ? 'focus' : 'collaborator';
		lines.push(`- \`${element.id}\` (${role})`);
	}

	lines.push(
		'',
		'## Code path coverage',
		'',
		'| Context role | Architectural element | Declared code path | Status | Matched files |',
		'| --- | --- | --- | --- | --- |'
	);

	for (const row of rows) {
		lines.push(
			`| ${escapeTableCell(row.role)} | ${escapeTableCell(row.elementId)} | ${escapeTableCell(`\`${row.codePath}\``)} | ${escapeTableCell(row.status)} | ${row.matchedFiles} |`
		);
	}

	lines.push('', '## Relevant filesystem tree', '');
	lines.push(...buildFilesystemTreeSection(roots));

	return lines.join('\n').trimEnd() + '\n';
}

export function buildRepositoryCoverageManifest(elements) {
	const sortedElements = [...elements].sort(compareElements);
	const rows = buildCoverageRows(sortedElements, null);
	const roots = collectRelevantTreeRoots(sortedElements);
	const lines = [
		'# Repository Code Path Coverage Manifest',
		'',
		'This generated manifest summarizes how the architecture maps onto the current filesystem so implementation sessions can tell the difference between missing code, empty owned areas, and genuinely populated code paths.',
		'',
		'Use this manifest before concluding that an architectural area is absent or before borrowing nearby files that are outside the declared ownership paths.',
		'',
		'## How to use this manifest',
		'',
		'- When a requested slice depends on paths marked `present`, start from those files.',
		'- When a requested slice depends on paths marked `path missing`, `directory exists but empty`, or `no matches for glob`, clarify whether the architecture is intentionally ahead of implementation.',
		'- When several collaborator areas are sparse, prefer expanding or refreshing architectural context before making cross-cutting implementation changes.',
		'',
		'## Code path coverage',
		'',
		'| Architectural element | Declared code path | Status | Matched files |',
		'| --- | --- | --- | --- |'
	];

	for (const row of rows) {
		lines.push(
			`| ${escapeTableCell(row.elementId)} | ${escapeTableCell(`\`${row.codePath}\``)} | ${escapeTableCell(row.status)} | ${row.matchedFiles} |`
		);
	}

	lines.push('', '## Relevant filesystem tree', '');
	lines.push(...buildFilesystemTreeSection(roots));

	return lines.join('\n').trimEnd() + '\n';
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
				sortByChanges: false,
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

function buildCoverageRows(elements, focusElementId) {
	const rows = [];

	for (const element of elements) {
		for (const codePath of element.code_paths ?? []) {
			const coverage = evaluateCodePathCoverage(codePath);
			rows.push({
				role: focusElementId && element.id === focusElementId ? 'focus' : 'collaborator',
				elementId: element.id,
				codePath,
				status: coverage.status,
				matchedFiles: coverage.matchedFiles,
				sortOrder: Number(element.order ?? 0)
			});
		}
	}

	rows.sort((left, right) => {
		return (
			left.sortOrder - right.sortOrder ||
			left.elementId.localeCompare(right.elementId) ||
			left.codePath.localeCompare(right.codePath)
		);
	});

	return rows;
}

function evaluateCodePathCoverage(codePath) {
	const normalizedPath = normalizeRepoPath(codePath);
	const rootPath = getPatternRoot(normalizedPath);
	const absoluteRootPath = path.join(getRepoRoot(), rootPath);
	const hasWildcards = /[*?[\]]/.test(normalizedPath);

	if (!hasWildcards) {
		if (!fs.existsSync(absoluteRootPath)) {
			return { status: 'path missing', matchedFiles: 0 };
		}

		const stat = fs.statSync(absoluteRootPath);

		if (stat.isFile()) {
			return { status: 'present', matchedFiles: 1 };
		}

		const files = listFilesRecursive(absoluteRootPath);
		return files.length > 0
			? { status: 'present', matchedFiles: files.length }
			: { status: 'directory exists but empty', matchedFiles: 0 };
	}

	if (!fs.existsSync(absoluteRootPath)) {
		return { status: 'path missing', matchedFiles: 0 };
	}

	const stat = fs.statSync(absoluteRootPath);
	const matcher = globToRegExp(normalizedPath);

	if (stat.isFile()) {
		const repoPath = normalizeRepoPath(path.relative(getRepoRoot(), absoluteRootPath));
		return matcher.test(repoPath)
			? { status: 'present', matchedFiles: 1 }
			: { status: 'no matches for glob', matchedFiles: 0 };
	}

	const files = listFilesRecursive(absoluteRootPath)
		.map((absolutePath) => normalizeRepoPath(path.relative(getRepoRoot(), absolutePath)))
		.filter((filePath) => matcher.test(filePath));

	if (files.length > 0) {
		return { status: 'present', matchedFiles: files.length };
	}

	return hasAnyEntries(absoluteRootPath)
		? { status: 'no matches for glob', matchedFiles: 0 }
		: { status: 'directory exists but empty', matchedFiles: 0 };
}

function collectRelevantTreeRoots(elements) {
	const roots = [];
	const seen = new Set();

	for (const element of elements) {
		for (const codePath of element.code_paths ?? []) {
			const rootPath = getPatternRoot(codePath);

			if (!seen.has(rootPath)) {
				seen.add(rootPath);
				roots.push(rootPath);
			}
		}
	}

	return roots.sort((left, right) => left.localeCompare(right));
}

function buildFilesystemTreeSection(roots) {
	const lines = [];

	if (roots.length === 0) {
		return ['No declared code paths.'];
	}

	for (const rootPath of roots) {
		const absoluteRootPath = path.join(getRepoRoot(), rootPath);
		lines.push(`### \`${rootPath}\``);
		lines.push('');

		if (!fs.existsSync(absoluteRootPath)) {
			lines.push('```text');
			lines.push(`${rootPath} (missing)`);
			lines.push('```');
			lines.push('');
			continue;
		}

		const stat = fs.statSync(absoluteRootPath);
		lines.push('```text');
		lines.push(rootPath);

		if (stat.isFile()) {
			lines.push('```');
			lines.push('');
			continue;
		}

		const treeLines = buildTreeLines(absoluteRootPath);

		if (treeLines.length === 0) {
			lines.push('└── (empty)');
		} else {
			lines.push(...treeLines);
		}

		lines.push('```');
		lines.push('');
	}

	return lines;
}

function buildTreeLines(directoryPath, prefix = '') {
	const entries = fs
		.readdirSync(directoryPath, { withFileTypes: true })
		.sort((left, right) => {
			if (left.isDirectory() !== right.isDirectory()) {
				return left.isDirectory() ? -1 : 1;
			}

			return left.name.localeCompare(right.name);
		});

	const lines = [];

	for (let index = 0; index < entries.length; index += 1) {
		const entry = entries[index];
		const isLast = index === entries.length - 1;
		const connector = isLast ? '└── ' : '├── ';
		const childPrefix = prefix + (isLast ? '    ' : '│   ');
		const suffix = entry.isDirectory() ? '/' : '';
		lines.push(`${prefix}${connector}${entry.name}${suffix}`);

		if (entry.isDirectory()) {
			lines.push(...buildTreeLines(path.join(directoryPath, entry.name), childPrefix));
		}
	}

	return lines;
}

function listFilesRecursive(directoryPath) {
	const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const absolutePath = path.join(directoryPath, entry.name);

		if (entry.isDirectory()) {
			files.push(...listFilesRecursive(absolutePath));
			continue;
		}

		if (entry.isFile()) {
			files.push(absolutePath);
		}
	}

	return files;
}

function hasAnyEntries(directoryPath) {
	return fs.readdirSync(directoryPath).length > 0;
}

function getPatternRoot(codePath) {
	const normalizedPath = normalizeRepoPath(codePath);
	const wildcardIndex = normalizedPath.search(/[*?[\]]/);

	if (wildcardIndex === -1) {
		return normalizedPath;
	}

	const prefix = normalizedPath.slice(0, wildcardIndex).replace(/\/+$/, '');
	return prefix || '.';
}

function normalizeRepoPath(value) {
	return String(value).replace(/\\/g, '/').replace(/^\.\//, '').replace(/\/+/g, '/');
}

function escapeTableCell(value) {
	return String(value).replace(/\|/g, '\\|');
}

function compareElements(left, right) {
	return Number(left.order ?? 0) - Number(right.order ?? 0) || left.id.localeCompare(right.id);
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