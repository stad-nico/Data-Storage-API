const path = require("path");

// https://stackoverflow.com/questions/37521893/determine-if-a-path-is-subdirectory-of-another-in-node-js

/**
 * Test if a subpath is a valid subdirectory of a parent path
 *
 * @param parent The parent path
 * @param subpath The path of the subdirectory to be checked
 * @returns
 */
export function isPathSubdirectory(parent: string, subpath: string): boolean {
	if (!path.isAbsolute(subpath)) {
		subpath = path.join(parent, subpath);
	}

	let relativePath = path.relative(parent, subpath);

	return relativePath.length > 0 && !relativePath.startsWith("..") && !path.isAbsolute(relativePath);
}
