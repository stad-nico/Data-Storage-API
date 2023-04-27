const path = require("path");

// https://stackoverflow.com/questions/37521893/determine-if-a-path-is-subdirectory-of-another-in-node-js

/**
 * Test if a subpath is a valid subdirectory of a parent path
 *
 * @param absoluteParentPath The parent path
 * @param absoluteSubPath The path of the subdirectory to be checked
 * @returns
 */
export function isPathSubdirectory(absoluteParentPath: string, absoluteSubPath: string): boolean {
	if (!path.isAbsolute(absoluteSubPath)) {
		absoluteSubPath = path.join(absoluteParentPath, absoluteSubPath);
	}

	let relativePath = path.relative(absoluteParentPath, absoluteSubPath);

	return relativePath.length > 0 && !relativePath.startsWith("..") && !path.isAbsolute(relativePath);
}
