import { Request, Response } from "express";
import { Socket } from "socket.io";

const { randomUUID } = require("crypto");
const fs = require("fs");
const express = require("express");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");
const multer = require("multer");

import { emptyDirectory } from "./src/fsHelpers";
import sendDirectoryContents from "./src/sendDirectoryContents";
import { sendDirectoryFolderStructureRecursive, sendDirectoryFolderStructure } from "./src/sendDirectoryFolderStructure";
import createDirectory from "./src/createDirectory";
import deleteDirectory from "./src/deleteDirectory";
import rename from "./src/rename";
import copyDirectory from "./src/copyDirectory";
import deleteFile from "./src/deleteFile";

declare module "express" {
	interface Request {
		files: any;
	}
}

const dpath = "C:/Users/stadl/Desktop/File-Server/files/";
const tempPath = "C:/Users/stadl/Desktop/File-Server/temp/";

const storage = multer.diskStorage({
	destination: function (req, file, callback) {
		let paths = [].concat(req.body.path);
		let pathname = paths[paths.length - 1].replace(/[^\/]+\/?$/im, "");
		let fullPath = path.join(tempPath, pathname);
		fs.mkdirSync(fullPath, { recursive: true });
		callback(null, fullPath);
	},
	filename: function (req, file, callback) {
		callback(null, Buffer.from(file.originalname, "latin1").toString("utf-8"));
	},
});

const upload = multer({
	storage: storage,
});

fs.watch(dpath, { recursive: true }, function (event, name) {
	console.info("change in directory detected; sending updates to sockets");
	io.sockets.emit("reload");
});

app.use(express.static(path.join(__dirname, "..", "client")));

app.get("/download", function (req: Request, res: Response) {
	try {
		let fullPath = path.join(dpath, req.query.path);
		let filename = fullPath.match(/[^/\\]+$/im)[0];
		console.log(fullPath, filename);
		res.download(fullPath, filename, { dotfiles: "allow" });
	} catch (e) {
		res.sendStatus(404);
		console.log(e);
	}
});

app.post("/upload", upload.any(), async function (req: Request, res: Response) {
	console.log("FINISHED UPLOADING");

	let err = false;
	let names = await fs.promises.readdir(tempPath);

	for (let name of names) {
		let fullTempPath = decodeURIComponent(path.join(tempPath, name));
		let fullDestinationPath = decodeURIComponent(path.join(dpath, req.body.destination, name));
		try {
			await fs.promises.rename(fullTempPath, fullDestinationPath);
		} catch (e) {
			// folder already present in destination, this error only gets thrown for directories, see https://github.com/nodejs/node/issues/21957
			try {
				await fs.promises.cp(fullTempPath, fullDestinationPath, {
					force: true,
					recursive: true,
				});
			} catch (e) {
				err = true;
				console.log(e);
			}
		}
	}

	// empty the temp folder
	try {
		console.log("clearing temp");
		await emptyDirectory(tempPath);
		console.log("done");
	} catch (e) {
		err = true;
		console.log(e);
	}

	if (err) {
		res.sendStatus(404);
	} else {
		res.sendStatus(200);
	}
});

app.get("*", function (req: Request, res: Response) {
	res.sendFile("index.html", {
		root: path.join(__dirname, "..", "client"),
	});
});

io.on("connection", function (socket: Socket) {
	console.log("A user connected");

	socket.emit("get-uuid", uuid => {
		if (uuid) {
			console.log("identified: " + uuid);
		} else {
			uuid = randomUUID();
			console.log("registered new: " + uuid);
			socket.emit("store-uuid", uuid);
		}
	});

	socket.on("is-path-valid", async (relPath: string, callback: (valid?: boolean) => void) => {
		callback(fs.existsSync(path.join(dpath, decodeURIComponent(relPath))));
	});

	socket.on("send-directory-folder-structure-recursive", async (relPath: string, callback?: (error?: unknown) => void) => {
		try {
			await sendDirectoryFolderStructureRecursive(socket, dpath, relPath);
			callback && callback();
		} catch (error) {
			callback && callback(error);
			console.log(error);
		}
	});

	socket.on("send-directory-folder-structure", async (relPath: string, callback?: (error?: unknown) => void) => {
		try {
			await sendDirectoryFolderStructure(socket, dpath, relPath);
			callback && callback();
		} catch (error) {
			callback && callback(error);
			console.log(error);
		}
	});

	socket.on("send-directory-contents", async (relPath: string, callback?: (error?: unknown) => void) => {
		try {
			await sendDirectoryContents(socket, dpath, relPath);
			callback && callback();
		} catch (error) {
			callback && callback(error);
			console.log(error);
		}
	});

	socket.on("create-directory", async (relPath: string, callback?: (error?: unknown) => void) => {
		try {
			await createDirectory(socket, dpath, relPath);
			io.sockets.emit("created-directory", relPath);
			callback && callback();
		} catch (error) {
			callback && callback(error);
			console.log(error);
		}
	});

	socket.on("delete-directory", async (relPath: string, callback: (error?: unknown) => void) => {
		try {
			await deleteDirectory(socket, dpath, relPath);
			io.sockets.emit("deleted-directory", relPath);
			callback && callback();
		} catch (error) {
			callback && callback(error);
			console.log(error);
		}
	});

	socket.on("delete-file", async (relPath: string, callback: (error?: unknown) => void) => {
		try {
			await deleteFile(socket, dpath, relPath);
			io.sockets.emit("deleted-file", relPath);
			callback && callback();
		} catch (error) {
			callback && callback(error);
			console.log(error);
		}
	});

	socket.on("rename", async (oldPath: string, newPath: string, callback: (error?: unknown) => void) => {
		try {
			await rename(socket, dpath, oldPath, newPath);

			if (newPath.endsWith("/") && oldPath.endsWith("/")) {
				io.sockets.emit("moved-directory", oldPath, newPath);
			} else {
				io.sockets.emit("moved-file", oldPath, newPath);
			}

			callback && callback();
		} catch (error) {
			callback && callback(error);
			console.log(error);
		}
	});

	socket.on("copy-directory", async (src: string, dest: string, callback: (error?: unknown) => void) => {
		try {
			await copyDirectory(socket, dpath, src, dest, false);
			callback && callback();
		} catch (error) {
			callback && callback(error);
			console.log(error);
		}
	});

	socket.on("copy-directory-force", async (src: string, dest: string, callback: (error?: unknown) => void) => {
		try {
			await copyDirectory(socket, dpath, src, dest, true);
			callback && callback();
		} catch (error) {
			callback && callback(error);
			console.log(error);
		}
	});

	socket.on("disconnect", function () {
		console.log("A user disconnected");
	});
});

http.listen(3000, function () {
	console.log("listening on localhost:3000");
});
