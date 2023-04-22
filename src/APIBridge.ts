import { BackendToFrontendEvent, FrontendToBackendEvent } from "src/APIEvents";

type EventHandler = (...args: any[]) => void;

export abstract class APIBridge {
	private _backendHandlers: Record<string, EventHandler[] | undefined>;
	private _frontendHandlers: Record<string, EventHandler[] | undefined>;

	constructor() {
		this._backendHandlers = {};
		this._frontendHandlers = {};
	}

	protected _on(event: FrontendToBackendEvent, handler: EventHandler): void {
		if (!this._frontendHandlers[event]) {
			this._frontendHandlers[event] = [];
		}

		this._frontendHandlers[event].push(handler);
	}

	protected _fire(event: BackendToFrontendEvent, data?: any): void {
		if (!this._backendHandlers[event]) {
			return;
		}

		this._backendHandlers[event].forEach(handler => handler(data));
	}

	public on(event: BackendToFrontendEvent, handler: EventHandler): void {
		if (!this._backendHandlers[event]) {
			this._backendHandlers[event] = [];
		}

		this._backendHandlers[event].push(handler);
	}

	public fire(event: FrontendToBackendEvent, data?: any): void {
		if (!this._frontendHandlers[event]) {
			return;
		}

		this._frontendHandlers[event].forEach(handler => handler(data));
	}
}
