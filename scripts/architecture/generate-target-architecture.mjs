import {
	loadElements,
	readText,
	stripLeadingHeading,
	writeText
} from './lib.mjs';

const { settings, elements } = loadElements();

const template = readText(settings.targetArchitectureTemplate);

const includePattern = /\{\{INCLUDE:([^}]+)\}\}/g;
const resolvedTemplate = template.replace(includePattern, (_, includePath) => {
	return stripLeadingHeading(readText(includePath.trim()));
});

const renderedElements = elements
	.map((element) => {
		const body = stripLeadingHeading(element.body);
		return body ? `## ${element.title}\n\n${body}` : `## ${element.title}`;
	})
	.join('\n\n');

const output = resolvedTemplate.replace('{{ELEMENTS}}', renderedElements).trimEnd() + '\n';

writeText(settings.targetArchitectureOutput, output);
console.log(`Generated ${settings.targetArchitectureOutput}`);
