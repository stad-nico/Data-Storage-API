import { io, Socket as IOSocket } from "socket.io-client";
import { APIBridge } from "src/APIBridge";
import { BackendToFrontendEvent, FrontendToBackendEvent } from "src/APIEvents";

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
			this._on(FrontendToBackendEvent[item], (data, callback) =>
				this._socket.emit(FrontendToBackendEvent[item], data, response => callback(response))
			);
		}
	}
}
