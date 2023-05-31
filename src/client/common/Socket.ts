import { io, Socket as IOSocket } from "socket.io-client";
import { APIBridge, EventMapType } from "src/APIBridge";
import { BackendToFrontendEvent, FrontendToBackendEvent } from "src/APIEvents";
import { DirectoryContentFile } from "src/DirectoryContentFile";
import { DirectoryContentFolder } from "src/DirectoryContentFolder";
import { DirectoryContentFolderRecursive } from "src/DirectoryContentFolderRecursive";
import { DirectoryContentType } from "src/DirectoryContentType";
import { Response } from "src/Response";
import { ServerError } from "src/ServerError";
import { ReturnType } from "src/server/src/getDirectoryContents";

export type EventMap = {
	[BackendToFrontendEvent.ConnectedToServer]: {
		returnType: void;
	};

	[FrontendToBackendEvent.GetDirectoryContents]: {
		argType: {
			path: string;
			contentType: DirectoryContentType;
		};
		returnType: ReturnType<EventMap[FrontendToBackendEvent.GetDirectoryContents]["argType"]["contentType"]>;
	};

	[FrontendToBackendEvent.GetDirectoryContentsRecursive]: {
		argType: {
			path: string;
			contentType: DirectoryContentType;
		};
		returnType: DirectoryContentFolderRecursive[];
	};
};

type R<T extends DirectoryContentType> = ReturnType<T>;

export class Socket extends APIBridge<EventMap> {
	private readonly _socket: IOSocket;

	constructor() {
		super();

		this._socket = this._connectToServer();
		this._bindEvents();
	}

	private _connectToServer(): IOSocket {
		return io();
	}

	private _bindEvents(): void {
		for (let item in BackendToFrontendEvent) {
			this._socket.on(BackendToFrontendEvent[item], arg => this._fire(BackendToFrontendEvent[item], arg));
		}

		for (let item in FrontendToBackendEvent) {
			this._on(FrontendToBackendEvent[item], async data => {
				return new Promise((resolve, reject) => {
					this._socket.emit(FrontendToBackendEvent[item], data, (responseType: Response, result: unknown | ServerError) => {
						if (responseType === Response.Ok) {
							resolve(result);
						} else if (responseType === Response.Error) {
							reject(result);
						}
					});
				});
			});
		}
	}
}
