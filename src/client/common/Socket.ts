import { io, Socket as IOSocket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { APIBridge, ConnectionStatus, EventMapType } from "src/APIBridge";
import { BackendToFrontendEvent, FrontendToBackendEvent } from "src/APIEvents";
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

	[FrontendToBackendEvent.DoesPathExist]: {
		argType: string;
		returnType: boolean;
	};

	[FrontendToBackendEvent.CheckLatency]: {
		returnType: void;
	};
};

export class Socket extends APIBridge<EventMap> {
	private _socket!: IOSocket;

	constructor() {
		super();
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

	public connect(): void {
		this._socket = io();
		this._bindEvents();
	}

	public async checkConnection(): Promise<ConnectionStatus> {
		const start = Date.now();

		return this.fire(FrontendToBackendEvent.CheckLatency, 0)
			.then(() => {
				return {
					status: Response.Ok,
					latency: Date.now() - start,
				};
			})
			.catch(() => {
				return {
					status: Response.Error,
					latency: Infinity,
				};
			});
	}
}
