import { EventMap } from "common/Socket";
import { BackendToFrontendEvent, FrontendToBackendEvent } from "src/APIEvents";
import { Response } from "src/Response";

export type EventMapType = Record<BackendToFrontendEvent | FrontendToBackendEvent, Options>;

type Options = {
	argType?: unknown;
	returnType: unknown;
};

type Handler<T extends FrontendToBackendEvent | BackendToFrontendEvent, E extends EventMapType> = E[T] extends { argType: any }
	? (arg: ArgumentType<T, E>) => ReturnType<T, E>
	: () => ReturnType<T, E>;

type PromiseHandler<T extends FrontendToBackendEvent | BackendToFrontendEvent, E extends EventMapType> = E[T] extends { returnType: any }
	? (arg: ArgumentType<T, E>) => Promise<ReturnType<T, E>>
	: () => Promise<ReturnType<T, E>>;

export type ReturnType<T extends FrontendToBackendEvent | BackendToFrontendEvent, E extends EventMapType> = E[T]["returnType"];
export type ArgumentType<T extends FrontendToBackendEvent | BackendToFrontendEvent, E extends EventMapType> = E[T]["argType"];

export type ConnectionStatus = {
	latency: number;
	status: Response;
};

export abstract class APIBridge<E extends EventMapType = EventMap> {
	private _backendHandlers: Record<string, Handler<BackendToFrontendEvent, E>[]>;
	private _frontendHandlers: Record<string, PromiseHandler<FrontendToBackendEvent, E>>;

	constructor() {
		this._backendHandlers = {};
		this._frontendHandlers = {};
	}

	protected _on<T extends FrontendToBackendEvent>(event: T, handler: PromiseHandler<T, E>): void {
		if (!this._frontendHandlers[event]) {
			this._frontendHandlers[event] = handler;
		}
	}

	protected _fire<T extends BackendToFrontendEvent>(event: T, arg: ArgumentType<T, E>): void {
		if (!this._backendHandlers[event]) {
			return;
		}

		for (let handler of this._backendHandlers[event]) {
			handler(arg);
		}
	}

	public abstract checkConnection(): Promise<ConnectionStatus>;
	public abstract connect(): unknown;

	public on<T extends BackendToFrontendEvent>(event: T, handler: Handler<T, E>): void {
		if (!this._backendHandlers[event]) {
			this._backendHandlers[event] = [];
		}

		this._backendHandlers[event].push(handler);
	}

	public fire<T extends FrontendToBackendEvent>(event: T, arg: ArgumentType<T, E>): Promise<ReturnType<T, E>> {
		if (!this._frontendHandlers[event]) {
			return;
		}

		return this._frontendHandlers[event](arg);
	}
}
