const fs = require("fs/promises");
const path = require("path");

import { Stats } from "fs";
import { DirectoryContentFile } from "../../DirectoryContentFile";
import { DirectoryContentFolder } from "../../DirectoryContentFolder";
import { DirectoryContentType } from "../../DirectoryContentType";
import { FileExtension } from "../../FileExtension";
import { getDirectorySize } from "./getDirectorySize";

type ReturnTypeMapType = Record<DirectoryContentType, any>;
export type ReturnType<T extends DirectoryContentType, M extends ReturnTypeMapType = ReturnTypeMap> = M[T];
type ReturnTypeMap = {
	[DirectoryContentType.File]: DirectoryContentFile[];
	[DirectoryContentType.Folder]: DirectoryContentFolder[];
	[DirectoryContentType.FolderOrFile]: (DirectoryContentFile | DirectoryContentFolder)[];
};

export async function getDirectoryContents<T extends DirectoryContentType>(
	baseDirectoryAbsolutePath: string,
	absoluteDirectoryPath: string,
	contentType: T
): Promise<ReturnType<T, ReturnTypeMap>> {
	let contents = [];
	let directoryPath = path.resolve(absoluteDirectoryPath);

	let contentNames: string[] = await fs.readdir(directoryPath);
	for (let name of contentNames) {
		let contentPath = path.resolve(path.join(directoryPath, name));

		if (!fs.access(contentPath)) {
			continue;
		}

		let stats: Stats = await fs.stat(contentPath);
		let isDirectory = stats.isDirectory();

		if (contentType === DirectoryContentType.Folder && !isDirectory) {
			continue;
		}
		if (contentType === DirectoryContentType.File && isDirectory) {
			continue;
		}

		let relativePath = path.relative(baseDirectoryAbsolutePath, absoluteDirectoryPath) || "/";
		relativePath = relativePath.endsWith("/") ? relativePath : relativePath + "/";

		if (isDirectory) {
			let size = await getDirectorySize(contentPath);
			contents.push(new DirectoryContentFolder(name, size, stats.mtime, relativePath));
		} else {
			contents.push(new DirectoryContentFile(path.parse(contentPath).name, stats.size, stats.mtime, relativePath, FileExtension.TXT));
		}
	}
	return contents;
}
