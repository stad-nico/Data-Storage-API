import { Socket } from "socket.io";
import * as fs from "fs";
import path from "path";
import { decodePath } from "./fsHelpers";

export default async function deleteFile(socket: Socket, defaultDirectoryPath: string, relPath: string) {
	defaultDirectoryPath = decodePath(defaultDirectoryPath);
	relPath = decodePath(relPath);
	let fullPath = path.join(defaultDirectoryPath, relPath);
	await fs.promises.rm(fullPath);
}
