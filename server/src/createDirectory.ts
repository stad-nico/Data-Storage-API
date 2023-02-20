import path from "path";
import * as fs from "fs";
import { Socket } from "socket.io";
import { decodePath } from "./fsHelpers";

export default async function createDirectory(socket: Socket, defaultDirectoryPath: string, newDirectoryRelPath: string) {
	defaultDirectoryPath = decodePath(defaultDirectoryPath);
	newDirectoryRelPath = decodePath(newDirectoryRelPath);

	let fullPath = path.join(defaultDirectoryPath, newDirectoryRelPath);
	await fs.promises.mkdir(fullPath);
}
