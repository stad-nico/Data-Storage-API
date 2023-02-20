const path = require("path");
import { Socket } from "socket.io";

import FileStats from "./FileStats";
import FolderStats from "./FolderStats";

import { getContentNames, createStatsObject, decodePath } from "./fsHelpers";

export default async function sendDirectoryContents(socket: Socket, defaultDirectoryPath: string, relativePath: string) {
	defaultDirectoryPath = decodePath(defaultDirectoryPath);
	relativePath = decodePath(relativePath);

	try {
		let absolutePath = decodePath(path.join(defaultDirectoryPath, relativePath));
		let data: (FileStats | FolderStats)[] = [];

		let names = await getContentNames(absolutePath);

		for (let name of names) {
			data.push(await createStatsObject(defaultDirectoryPath, relativePath, name));
		}

		socket.emit("receive-directory-contents", data);
	} catch (error) {
		console.log(error);
	}
}
