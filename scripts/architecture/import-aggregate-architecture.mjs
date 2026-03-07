/**
 * @role architecture-bootstrap-script
 * @owns first-time decomposition of the aggregate architecture markdown into source artifacts
 * @not-owns ongoing generation of target-architecture.md or context XML artifacts
 * @notes This script is intentionally one-way bootstrap tooling. It combines aggregate markdown with seed metadata.
 */

import fs from 'node:fs';
import path from 'node:path';

const args = parseArgs(process.argv.slice(2));

const sourcePath = args.source ?? 'architecture/target-architecture.md';
const manifestPath = args.manifest ?? 'architecture/element-seed-metadata.json';
const elementsDir = args.elementsDir ?? 'architecture/elements';
const ownershipPath = args.ownership ?? 'architecture/ownership-matrix.md';
const lifecyclePath = args.lifecycle ?? 'architecture/lifecycle-map.md';
const recoveryPath = args.recovery ?? 'architecture/recovery-map.md';
const templatePath = args.template ?? 'architecture/target-architecture.template.md';

const source = readText(sourcePath);
const manifest = JSON.parse(readText(manifestPath));

const sections = parseH2Sections(source);
const sectionMap = new Map(sections.map((section) => [section.title, section]));

const ownershipSection = mustGetSection(sectionMap, 'Ownership Matrix');
const lifecycleSection = mustGetSection(sectionMap, 'Lifecycle Map');
const recoverySection = mustGetSection(sectionMap, 'Recovery Map');
const architecturalElementsSection = mustGetSection(sectionMap, 'Architectural Elements');

const elementSections = parseH2Sections(architecturalElementsSection.content);
const elementSectionMap = new Map(elementSections.map((section) => [section.title, section]));

writeWithGuard(
	ownershipPath,
	buildMarkdownArtifact({
		role: 'architecture-artifact',
		owns: 'the compact ownership map for major state areas',
		notOwns: 'detailed service contracts or implementation mechanics',
		notes: 'Keep this file small enough to include in all coding sessions.',
		body: normalizeDocumentSection(ownershipSection.content, 'Ownership Matrix')
	}),
	args.force
);

writeWithGuard(
	lifecyclePath,
	buildMarkdownArtifact({
		role: 'architecture-artifact',
		owns: 'the high-level runtime lifecycle map',
		notOwns: 'detailed service contracts or UI copy',
		notes: 'Keep transitions concise and implementation-agnostic.',
		body: normalizeDocumentSection(lifecycleSection.content, 'Lifecycle Map')
	}),
	args.force
);

writeWithGuard(
	recoveryPath,
	buildMarkdownArtifact({
		role: 'architecture-artifact',
		owns: 'the compact recovery-state map for major failure classes',
		notOwns: 'detailed error-copy or implementation mechanics',
		notes: 'Keep this file small and explicit.',
		body: normalizeDocumentSection(recoverySection.content, 'Recovery Map')
	}),
	args.force
);

for (const element of manifest.elements) {
	const sourceSection = elementSectionMap.get(element.title);
	const outputPath = path.join(elementsDir, `${element.id}.md`).replace(/\\/g, '/');

	const body = sourceSection
		? normalizeElementBody(sourceSection.raw, element.title)
		: buildFallbackElementBody(element);

	writeWithGuard(outputPath, buildElementFile(element, body), args.force);

	if (!sourceSection) {
		console.warn(
			`[architecture import] No aggregate section found for "${element.title}". ` +
				`Generated a metadata-backed stub at ${outputPath}.`
		);
	}
}

if (args.writeTemplate || !fs.existsSync(path.resolve(templatePath))) {
	writeWithGuard(templatePath, buildTemplate(), args.force || !fs.existsSync(path.resolve(templatePath)));
}

console.log(`Imported ownership matrix to ${ownershipPath}`);
console.log(`Imported lifecycle map to ${lifecyclePath}`);
console.log(`Imported recovery map to ${recoveryPath}`);
console.log(`Imported ${manifest.elements.length} architectural element files into ${elementsDir}`);

if (args.writeTemplate || !fs.existsSync(path.resolve(templatePath))) {
	console.log(`Wrote target architecture template to ${templatePath}`);
}

function parseArgs(argv) {
	const parsed = {
		force: false,
		writeTemplate: false
	};

	for (let index = 0; index < argv.length; index += 1) {
		const token = argv[index];

		if (token === '--force') {
			parsed.force = true;
			continue;
		}

		if (token === '--write-template') {
			parsed.writeTemplate = true;
			continue;
		}

		if (token.startsWith('--')) {
			const key = token.slice(2);
			const value = argv[index + 1];

			if (!value || value.startsWith('--')) {
				throw new Error(`Missing value for argument ${token}`);
			}

			parsed[key] = value;
			index += 1;
			continue;
		}

		throw new Error(`Unknown argument: ${token}`);
	}

	return parsed;
}

function readText(filePath) {
	return fs.readFileSync(path.resolve(filePath), 'utf8');
}

function ensureDir(filePath) {
	fs.mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true });
}

function writeWithGuard(filePath, content, force) {
	const absolutePath = path.resolve(filePath);

	if (fs.existsSync(absolutePath) && !force) {
		throw new Error(
			`Refusing to overwrite existing file ${filePath}. ` +
				`Re-run with --force if this is intentional.`
		);
	}

	ensureDir(filePath);
	fs.writeFileSync(absolutePath, content.trimEnd() + '\n', 'utf8');
}

function parseH2Sections(markdown) {
	const matches = [...markdown.matchAll(/^##\s+(.+?)\s*$/gm)];

	return matches.map((match, index) => {
		const start = match.index;
		const end = index + 1 < matches.length ? matches[index + 1].index : markdown.length;
		const raw = markdown.slice(start, end).trim();
		const firstLineBreak = raw.indexOf('\n');
		const content = firstLineBreak === -1 ? '' : raw.slice(firstLineBreak + 1).trim();

		return {
			title: match[1].trim(),
			raw,
			content
		};
	});
}

function mustGetSection(sectionMap, title) {
	const section = sectionMap.get(title);

	if (!section) {
		throw new Error(`Missing required section "${title}" in aggregate architecture markdown.`);
	}

	return section;
}

function normalizeDocumentSection(content, title) {
	const trimmed = content.trim();

	if (!trimmed) {
		throw new Error(`Section "${title}" is empty.`);
	}

	if (trimmed.startsWith('# ')) {
		return trimmed;
	}

	return `# ${title}\n\n${trimmed}`;
}

function normalizeElementBody(rawSection, title) {
	return rawSection.replace(/^##\s+.*$/m, `# ${title}`).trim();
}

function buildFallbackElementBody(element) {
	const collaborators = (element.collaborators ?? []).map((value) => `- ${value}`).join('\n') || '- none yet';
	const codePaths = (element.code_paths ?? []).map((value) => `- ${value}`).join('\n') || '- none yet';

	return `# ${element.title}

## Responsibility
Define and maintain the runtime contract for ${element.title.toLowerCase()}.

## Owns
- responsibilities to be refined during implementation
- authoritative boundaries for this architectural element

## Does not own
- responsibilities owned by collaborator elements
- concerns outside this element’s declared boundary

## Collaborators
${collaborators}

## Invariants
- this element must maintain an explicit contract
- ownership must stay aligned with the ownership matrix
- collaborators must stay current with implementation reality

## Code ownership hints
${codePaths}`;
}

function buildMarkdownArtifact({ role, owns, notOwns, notes, body }) {
	return [
		'<!--',
		`  @role ${role}`,
		`  @owns ${owns}`,
		`  @not-owns ${notOwns}`,
		`  @notes ${notes}`,
		'-->',
		'',
		body
	].join('\n');
}

function buildElementFile(element, body) {
	const frontmatterLines = ['---'];

	frontmatterLines.push(`id: ${element.id}`);
	frontmatterLines.push(`title: ${element.title}`);
	frontmatterLines.push(`order: ${element.order}`);
	frontmatterLines.push(`kind: ${element.kind}`);

	frontmatterLines.push('branch_aliases:');
	for (const alias of element.branch_aliases ?? []) {
		frontmatterLines.push(`  - ${alias}`);
	}

	frontmatterLines.push('collaborators:');
	for (const collaborator of element.collaborators ?? []) {
		frontmatterLines.push(`  - ${collaborator}`);
	}

	frontmatterLines.push('code_paths:');
	for (const codePath of element.code_paths ?? []) {
		frontmatterLines.push(`  - ${codePath}`);
	}

	frontmatterLines.push('---', '');

	return frontmatterLines.join('\n') + body;
}

function buildTemplate() {
	return `<!--
  @role architecture-template
  @owns the template used to generate the full target architecture document
  @not-owns the source content for individual elements
  @notes Do not place element-specific rules here; those belong in the element files.
-->

# Target Architecture

> This file is generated from the source artifacts under \`architecture/\`.  
> Edit the element files, ownership matrix, lifecycle map, recovery map, or this template.  
> Do not edit the generated output manually.

## Ownership Matrix

{{INCLUDE:architecture/ownership-matrix.md}}

## Lifecycle Map

{{INCLUDE:architecture/lifecycle-map.md}}

## Recovery Map

{{INCLUDE:architecture/recovery-map.md}}

## Architectural Elements

{{ELEMENTS}}
`;
}