import path from 'node:path';
import {
	buildRepomixConfig,
	collectElementContext,
	collectUniqueCodePaths,
	ensureDir,
	inferFocusElement,
	loadElements,
	writeText
} from './lib.mjs';

const branchFlagIndex = process.argv.indexOf('--branch');
const branchName = branchFlagIndex >= 0 ? process.argv[branchFlagIndex + 1] : process.env.BRANCH_NAME;

const { settings, elements } = loadElements();
ensureDir(settings.contextConfigTempDir);
ensureDir(settings.generatedContextsDir);

for (const element of elements) {
	const contextElements = collectElementContext(element.id, elements);
	const include = [
		...settings.alwaysIncludeInElementContexts,
		...contextElements.map((item) => item.path),
		...collectUniqueCodePaths(contextElements)
	];

	const config = buildRepomixConfig({
		outputPath: path.join(settings.generatedContextsDir, `${element.id}.context.xml`).replace(/\\/g, '/'),
		include,
		headerText: `Focused architectural context for ${element.title}.`
	});

	writeText(
		path.join(settings.contextConfigTempDir, `${element.id}.config.json`).replace(/\\/g, '/'),
		JSON.stringify(config, null, 2) + '\n'
	);
}

const focusElement = inferFocusElement(branchName, elements, settings.defaultFocusElement);

if (!focusElement) {
	throw new Error(
		`Could not infer a focus architectural element from branch "${branchName}". ` +
			`Add a matching branch alias to an element file or rename the branch.`
	);
}

const focusContextElements = collectElementContext(focusElement.id, elements);
const focusInclude = [
	...settings.alwaysIncludeInElementContexts,
	...focusContextElements.map((item) => item.path),
	...collectUniqueCodePaths(focusContextElements)
];

const currentFocusConfig = buildRepomixConfig({
	outputPath: path.join(settings.generatedContextsDir, settings.currentFocusContextName).replace(/\\/g, '/'),
	include: focusInclude,
	headerText: `Current branch focus context for ${focusElement.title}.`
});

writeText(
	path.join(settings.contextConfigTempDir, 'current-focus.config.json').replace(/\\/g, '/'),
	JSON.stringify(currentFocusConfig, null, 2) + '\n'
);

console.log(`Generated context configs for ${elements.length} architectural elements.`);
console.log(`Current focus element: ${focusElement.id}`);