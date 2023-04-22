import { Response, Request } from "express";
import { Socket } from "socket.io";
import { BackendToFrontendEvent, FrontendToBackendEvent } from "./APIEvents";

require("dotenv").config();

const path = require("path");

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const PORT = process.env.SERVER_PORT || 4000;

app.use(express.static(path.join(__dirname, "../dev")));

app.get("*", (req: Request, res: Response) => {
	res.sendFile(path.resolve(__dirname, "../dev/index.html"));
});

io.on("connection", (client: Socket) => {
	console.log("connection");
	client.emit(BackendToFrontendEvent.ConnectedToServer);

	client.on(FrontendToBackendEvent.ValidatePath, data => {
		console.log("event validate path received on server");
	});
});

server.listen(PORT, () => {
	console.log(`Running on localhost: ${PORT}`);
});
