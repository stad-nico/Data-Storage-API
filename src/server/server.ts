import { Response, Request } from "express";
import { Socket } from "socket.io";
import { BackendToFrontendEvent, FrontendToBackendEvent } from "../APIEvents";
import { isPathSubdirectory } from "./src/isPathSubdirectory";
import { isAbsolutePathEqual } from "./src/isPathEqual";
import { getDirectoryContents } from "./src/getDirectoryContents";
import { doesPathExist } from "./src/doesPathExist";
import { Response as ServerResponse } from "../Response";
import { createSaveLocation } from "./src/createSaveLocation";
import { ArgumentType, ReturnType } from "src/APIBridge";
import { EventMap } from "common/Socket";
import { ServerError } from "src/ServerError";
import { getDirectoryContentsRecursive } from "./src/getDirectoryContentsRecursive";

const dotenv = require("dotenv");
dotenv.config();

createSaveLocation();

const path = require("path");

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const PORT = process.env.SERVER_PORT || 4000;

const SAVE_LOCATION = process.env.SAVE_LOCATION;

app.use(express.static(path.join(__dirname, "../../dev")));

app.get("*", (req: Request, res: Response) => {
	//! not needed, using express.static serves index.html automatically
	// res.sendFile("index.html", { root: path.resolve(path.join(__dirname, "../../dev")) });
});

io.on("connection", (client: Socket) => {
	console.log("connection");
	client.emit(BackendToFrontendEvent.ConnectedToServer);

	client.on(
		FrontendToBackendEvent.GetDirectoryContents,
		async (
			data: ArgumentType<FrontendToBackendEvent.GetDirectoryContents, EventMap>,
			callback: (response: ServerResponse, data: ReturnType<FrontendToBackendEvent.GetDirectoryContents, EventMap> | ServerError) => void
		) => {
			const testPath = path.resolve(path.join(SAVE_LOCATION, data.path));
			if (isPathSubdirectory(SAVE_LOCATION, testPath) || isAbsolutePathEqual(SAVE_LOCATION, testPath)) {
				if (await doesPathExist(testPath)) {
					try {
						let result = await getDirectoryContents(SAVE_LOCATION, testPath, data.contentType);
						return callback(ServerResponse.Ok, result);
					} catch (error) {
						return callback(ServerResponse.Error, {
							message: error,
							status: ServerResponse.Error,
							event: FrontendToBackendEvent.GetDirectoryContents,
						});
					}
				}

				return callback(ServerResponse.Error, {
					message: "Path does not exist",
					status: ServerResponse.Error,
					event: FrontendToBackendEvent.GetDirectoryContents,
				});
			}

			return callback(ServerResponse.Error, {
				message: "Path is not valid",
				status: ServerResponse.Error,
				event: FrontendToBackendEvent.GetDirectoryContents,
			});
		}
	);

	client.on(
		FrontendToBackendEvent.GetDirectoryContentsRecursive,
		async (
			data: ArgumentType<FrontendToBackendEvent.GetDirectoryContentsRecursive, EventMap>,
			callback: (
				response: ServerResponse,
				data: ReturnType<FrontendToBackendEvent.GetDirectoryContentsRecursive, EventMap> | ServerError
			) => void
		) => {
			const testPath = path.resolve(path.join(SAVE_LOCATION, data.path));
			if (isPathSubdirectory(SAVE_LOCATION, testPath) || isAbsolutePathEqual(SAVE_LOCATION, testPath)) {
				if (await doesPathExist(testPath)) {
					try {
						let result = await getDirectoryContentsRecursive(SAVE_LOCATION, testPath /*, data.contentType*/);
						return callback(ServerResponse.Ok, result);
					} catch (error) {
						return callback(ServerResponse.Error, {
							message: error,
							status: ServerResponse.Error,
							event: FrontendToBackendEvent.GetDirectoryContentsRecursive,
						});
					}
				}

				return callback(ServerResponse.Error, {
					message: "Path does not exist",
					status: ServerResponse.Error,
					event: FrontendToBackendEvent.GetDirectoryContentsRecursive,
				});
			}

			return callback(ServerResponse.Error, {
				message: "Path is not valid",
				status: ServerResponse.Error,
				event: FrontendToBackendEvent.GetDirectoryContentsRecursive,
			});
		}
	);
});

server.listen(PORT, () => {
	console.log(`Running on localhost: ${PORT}`);
});
