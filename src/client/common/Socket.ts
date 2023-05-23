import { io, Socket as IOSocket } from "socket.io-client";
import { APIBridge } from "src/APIBridge";
import { BackendToFrontendEvent, FrontendToBackendEvent } from "src/APIEvents";
import { Response } from "src/Response";

export class Socket extends APIBridge {
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
			this._socket.on(BackendToFrontendEvent[item], () => this._fire(BackendToFrontendEvent[item]));
		}

		for (let item in FrontendToBackendEvent) {
			this._on(FrontendToBackendEvent[item], async data => {
				return new Promise((resolve, reject) => {
					this._socket.emit(FrontendToBackendEvent[item], data, (responseType: Response, result: unknown | string) => {
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
