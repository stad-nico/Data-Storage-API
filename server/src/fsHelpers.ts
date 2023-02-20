const path = require("path");
import * as fs from "fs";

import FolderStats from "./FolderStats";
import FileStats from "./FileStats";

export function decodePath(p) {
	return decodeURIComponent(p);
}

export async function emptyDirectory(dirPath) {
	dirPath = decodePath(dirPath);
	let contents = await getContentNames(dirPath);

	for (let name of contents) {
		try {
			let fullPath = decodePath(path.join(dirPath, name));
			let stat = await getFileStats(fullPath);

			if (stat.isDirectory()) {
				if ((await getContentNames(fullPath)).length) {
					await emptyDirectory(fullPath);
					await fs.promises.rmdir(fullPath);
				} else {
					await fs.promises.rmdir(fullPath);
				}
			} else {
				await fs.promises.rm(fullPath);
			}
		} catch (e) {
			console.log(e);
		}
	}
}

export async function createStatsObject(defaultDirectoryPath: string, relativePath: string, name: string): Promise<FileStats | FolderStats> {
	let namePath = decodePath(path.join(relativePath, name));
	let fullPath = decodePath(path.join(defaultDirectoryPath, namePath));

	let stats = await getFileStats(fullPath);

	if (stats.isDirectory()) {
		return new FolderStats(name, namePath + "\\");
	} else if (stats.isFile()) {
		return new FileStats(name, await getFileSize(fullPath), namePath);
	} else {
		throw new Error("path is neither a file nor a directory");
	}
}

export async function getFileSize(absolutePath: string) {
	absolutePath = decodePath(absolutePath);
	return (await getFileStats(absolutePath)).size;
}

export async function getContentNames(absoluteDirectoryPath: string) {
	absoluteDirectoryPath = decodePath(absoluteDirectoryPath);
	return await fs.promises.readdir(absoluteDirectoryPath);
}

export async function getFileStats(absolutePath: string): Promise<fs.Stats> {
	absolutePath = decodePath(absolutePath);
	return await fs.promises.stat(absolutePath);
}

export async function hasSubDirectories(absoluteDirectoryPath: string): Promise<boolean> {
	let names = await getContentNames(decodePath(absoluteDirectoryPath));

	for (let name of names) {
		if ((await getFileStats(decodePath(path.join(absoluteDirectoryPath, name)))).isDirectory()) {
			return true;
		}
	}

	return false;
}
