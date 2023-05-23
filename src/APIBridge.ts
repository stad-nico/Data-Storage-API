import { BackendToFrontendEvent, FrontendToBackendEvent } from "src/APIEvents";

type EventHandler = (data: any, callback: (response: any) => void) => void;

export abstract class APIBridge {
	private _backendHandlers: Record<string, (data: any) => any | undefined>;
	private _frontendHandlers: Record<string, (data: any) => Promise<any> | undefined>;

	constructor() {
		this._backendHandlers = {};
		this._frontendHandlers = {};
	}

	protected _on(event: FrontendToBackendEvent, handler: (data: any) => Promise<any>): void {
		if (!this._frontendHandlers[event]) {
			this._frontendHandlers[event] = handler;
		}
	}

	protected _fire(event: BackendToFrontendEvent, data?: any): void {
		if (!this._backendHandlers[event]) {
			return;
		}

		return this._backendHandlers[event](data);
	}

	public on(event: BackendToFrontendEvent, handler: (data: any) => any): void {
		if (!this._backendHandlers[event]) {
			this._backendHandlers[event] = handler;
		}
	}

	public fire(event: FrontendToBackendEvent, data?: any): Promise<any> {
		if (!this._frontendHandlers[event]) {
			return;
		}

		return this._frontendHandlers[event](data);
	}
}
