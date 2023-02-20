import * as fs from "fs";
const path = require("path");
import { Socket } from "socket.io";

import { getContentNames, getFileStats, hasSubDirectories, decodePath } from "./fsHelpers";

type FolderObject = {
	name: string;
	path: string;
	hasSubDirectories: boolean;
	contents?: FolderObject[];
};

export async function sendDirectoryFolderStructure(socket: Socket, defaultDirectoryPath: string, relativePath: string) {
	defaultDirectoryPath = decodePath(defaultDirectoryPath);
	relativePath = decodePath(relativePath);
	socket.emit("receive-directory-folder-structure", await getDirectoryFolderStructure(defaultDirectoryPath, relativePath, true));
}

export async function sendDirectoryFolderStructureRecursive(socket: Socket, defaultDirectoryPath: string, relativePath: string) {
	defaultDirectoryPath = decodePath(defaultDirectoryPath);
	relativePath = decodePath(relativePath);
	let folderObjects: FolderObject[] = [];

	if (relativePath === "/") {
		var paths = [""];
	} else {
		var paths = relativePath.replace(/\/$/gim, "").split("/");
	}

	let rel = "/";

	for (let part of paths) {
		rel = path.join(rel, part).replaceAll("\\", "/");
		folderObjects.push(await getDirectoryFolderStructure(defaultDirectoryPath, rel, true));
	}

	socket.emit("receive-directory-folder-structure-recursive", {
		folderObjects: folderObjects,
	});
}

async function getDirectoryFolderStructure(defaultDirectoryPath: string, relPath: string, includeContents: boolean = false) {
	defaultDirectoryPath = decodePath(defaultDirectoryPath);
	relPath = decodePath(relPath);

	let fullPath = decodePath(path.join(defaultDirectoryPath, relPath));

	if (!(await getFileStats(fullPath)).isDirectory()) {
		throw Error("path not a directory");
	}

	let folderObject: FolderObject = {
		name: relPath.match(/([^\/]+(?=\/?$))|^\/$/gim)[0],
		path: relPath.endsWith("/") ? relPath : relPath + "/",
		hasSubDirectories: await hasSubDirectories(fullPath),
	};

	if (includeContents) {
		folderObject.contents = [];

		for (let name of await getContentNames(fullPath)) {
			if ((await getFileStats(decodePath(path.join(fullPath, name)))).isDirectory()) {
				folderObject.contents.push(
					await getDirectoryFolderStructure(defaultDirectoryPath, decodePath(path.join(relPath, name)).replaceAll("\\", "/"), false)
				);
			}
		}
	}

	return folderObject;
}
