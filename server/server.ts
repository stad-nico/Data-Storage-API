import { Request, Response, NextFunction } from "express";
import { Socket } from "socket.io";

const { randomUUID } = require("crypto");
const fs = require("fs");
const express = require("express");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");

import sendDirectoryContents from "./src/sendDirectoryContents";
import sendDirectoryFolderStructureRecursive from "./src/sendDirectoryFolderStructure";
import createDirectory from "./src/createDirectory";
import deleteDirectory from "./src/deleteDirectory";
import rename from "./src/rename";
import copyDirectory from "./src/copyDirectory";

let dpath = "C:/Users/stadl/Desktop/File-Server/files/";

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
		console.log(e);
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
		callback(fs.existsSync(path.join(dpath, relPath)));
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
			callback && callback();
		} catch (error) {
			callback && callback(error);
			console.log(error);
		}
	});

	socket.on("delete-directory", async (relPath: string, callback: (error?: unknown) => void) => {
		try {
			await deleteDirectory(socket, dpath, relPath);
			callback && callback();
		} catch (error) {
			callback && callback(error);
			console.log(error);
		}
	});

	socket.on("rename", async (oldPath: string, newPath: string, callback: (error?: unknown) => void) => {
		try {
			await rename(socket, dpath, oldPath, newPath);
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
