import { Response, Request } from "express";
import { Socket } from "socket.io";
import { BackendToFrontendEvent, FrontendToBackendEvent } from "./APIEvents";
import { Event } from "./client/common/EventEmitter";
import { DirectoryContentElement } from "./DirectoryContentElement";
import { DirectoryContentType } from "./DirectoryContentType";

require("dotenv").config();

const path = require("path");

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const PORT = process.env.SERVER_PORT || 4000;

const SAVE_LOCATION = "C:\\Users\\stadl\\Desktop\\File Server Save Location";

app.use(express.static(path.join(__dirname, "../dev")));

app.get("*", (req: Request, res: Response) => {
	res.sendFile(path.resolve(__dirname, "../dev/index.html"));
});

io.on("connection", (client: Socket) => {
	console.log("connection");
	client.emit(BackendToFrontendEvent.ConnectedToServer);

	client.on(FrontendToBackendEvent.ValidatePath, event => {
		console.log("event validate path received on server");
	});

	client.on(FrontendToBackendEvent.GetDirectoryContents, (event: Event, callback: (...args: any) => void) => {
		console.log("event send directory contents received", event.data);
		callback([new DirectoryContentElement(DirectoryContentType.Folder, "test", 100, new Date(Date.now()))]);
	});
});

server.listen(PORT, () => {
	console.log(`Running on localhost: ${PORT}`);
});
