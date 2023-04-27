const path = require("path");

export function isAbsolutePathEqual(absolutePathA: string, absolutePathB: string): boolean {
	if (!path.isAbsolute(absolutePathA) || !path.isAbsolute(absolutePathB)) {
		return false;
	}

	return path.relative(absolutePathA, absolutePathB).length === 0;
}
