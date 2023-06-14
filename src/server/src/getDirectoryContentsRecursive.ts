const path = require("path");
import { DirectoryContentFolder } from "../../DirectoryContentFolder";
import { DirectoryContentFolderRecursive } from "../../DirectoryContentFolderRecursive";
import { DirectoryContentType } from "../../DirectoryContentType";
import { getDirectoryContents } from "./getDirectoryContents";

export async function getDirectoryContentsRecursive(
	baseDirectoryAbsolutePath: string,
	absoluteDirectoryPath: string
): Promise<DirectoryContentFolderRecursive[]> {
	let result: DirectoryContentFolderRecursive[] = [];
	let contents = await getDirectoryContents(baseDirectoryAbsolutePath, absoluteDirectoryPath, DirectoryContentType.FolderOrFile);

	for (let element of contents) {
		if (element instanceof DirectoryContentFolder) {
			let recursiveFolderElement = new DirectoryContentFolderRecursive(element.name, element.size, element.lastEdited, element.relativePath);
			// console.log(path.join(absoluteDirectoryPath, element.name));
			let contents = await getDirectoryContents(
				baseDirectoryAbsolutePath,
				path.join(absoluteDirectoryPath, element.name),
				DirectoryContentType.FolderOrFile
			);

			for (let element of contents) {
				recursiveFolderElement.add(element);
			}

			result.push(recursiveFolderElement);
		}
	}

	return result;
}
