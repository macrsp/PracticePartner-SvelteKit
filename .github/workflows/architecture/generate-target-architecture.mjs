import {
	loadElements,
	readText,
	stripCommentHeader,
	writeText
} from './lib.mjs';

const { settings, elements } = loadElements();

const template = readText(settings.targetArchitectureTemplate);

const includePattern = /\{\{INCLUDE:([^}]+)\}\}/g;
const resolvedTemplate = template.replace(includePattern, (_, includePath) => {
	return stripCommentHeader(readText(includePath.trim()));
});

const renderedElements = elements
	.map((element) => `## ${element.title}\n\n${element.body}`)
	.join('\n\n');

const output = resolvedTemplate.replace('{{ELEMENTS}}', renderedElements).trimEnd() + '\n';

writeText(settings.targetArchitectureOutput, output);
console.log(`Generated ${settings.targetArchitectureOutput}`);