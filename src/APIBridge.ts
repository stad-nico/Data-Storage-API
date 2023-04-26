import { BackendToFrontendEvent, FrontendToBackendEvent } from "src/APIEvents";

type EventHandler = (data: any, callback: (response: any) => void) => void;

export abstract class APIBridge {
	private _backendHandlers: Record<string, EventHandler | undefined>;
	private _frontendHandlers: Record<string, EventHandler | undefined>;

	constructor() {
		this._backendHandlers = {};
		this._frontendHandlers = {};
	}

	protected _on(event: FrontendToBackendEvent, handler: EventHandler): void {
		if (!this._frontendHandlers[event]) {
			this._frontendHandlers[event] = handler;
		}
	}

	protected _fire(event: BackendToFrontendEvent, data?: any, callback?: (response: any) => void): void {
		if (!this._backendHandlers[event]) {
			return;
		}

		return this._backendHandlers[event](data, callback);
	}

	public on(event: BackendToFrontendEvent, handler: EventHandler): void {
		if (!this._backendHandlers[event]) {
			this._backendHandlers[event] = handler;
		}
	}

	public fire<T>(event: FrontendToBackendEvent, data?: any, callback?: (response: T) => void): void {
		if (!this._frontendHandlers[event]) {
			return;
		}

		this._frontendHandlers[event](data, callback);
	}
}
