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

const focusResult = inferFocusElement(branchName, elements, settings.defaultFocusElement);
const focusElement = focusResult.element;

const focusContextElements = collectElementContext(focusElement.id, elements);
const focusInclude = [
	...settings.alwaysIncludeInElementContexts,
	...focusContextElements.map((item) => item.path),
	...collectUniqueCodePaths(focusContextElements)
];

const headerText = focusResult.usedDefault
	? `Current branch focus context for ${focusElement.title}. Generated using the default focus fallback because the branch name did not match an architectural element alias.`
	: `Current branch focus context for ${focusElement.title}.`;

const currentFocusConfig = buildRepomixConfig({
	outputPath: path.join(settings.generatedContextsDir, settings.currentFocusContextName).replace(/\\/g, '/'),
	include: focusInclude,
	headerText
});

writeText(
	path.join(settings.contextConfigTempDir, 'current-focus.config.json').replace(/\\/g, '/'),
	JSON.stringify(currentFocusConfig, null, 2) + '\n'
);

console.log(`Generated context configs for ${elements.length} architectural elements.`);
console.log(
	focusResult.usedDefault
		? `Current focus element: ${focusElement.id} (default fallback for branch "${branchName}")`
		: `Current focus element: ${focusElement.id} (matched alias "${focusResult.matchedAlias}")`
);