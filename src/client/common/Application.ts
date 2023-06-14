import { UserInterfaceService } from "common/services/UserInterfaceService";
import { Layout } from "common/ui/Layout";
import { Environment } from "common/Environment";
import { Theme } from "common/ui/Theme";
import { Socket } from "common/Socket";
import { EventEmitter } from "common/EventEmitter";
import { APIBridge, ConnectionStatus } from "src/APIBridge";
import { Response } from "src/Response";

export interface IApplication {
	readonly environment: Environment;
	readonly currentPath: string;
}

export abstract class Application implements IApplication {
	/**
	 * The path to the location whose contents are being displayed
	 */
	public currentPath: string;

	/**
	 * The environment
	 */
	public readonly environment: Environment;

	/**
	 * UserInterfaceService that handles ui (events & creation)
	 */
	protected _userInterfaceService: UserInterfaceService;

	/**
	 * EventEmitter for communicating with UI Components
	 */
	protected _eventEmitter: EventEmitter;

	/**
	 * Bridge for communicating with backend
	 */
	protected _apiBridge: APIBridge;
	/**
	 * Creates a new Application instance
	 */
	protected constructor(layout: Layout, theme: Theme, environment: Environment, apiBridge: APIBridge) {
		this.environment = environment;
		this._apiBridge = apiBridge;
		this._eventEmitter = new EventEmitter();

		this.currentPath = this.fetchCurrentPath();
		this._userInterfaceService = new UserInterfaceService(layout, theme, this._apiBridge, this._eventEmitter);

		this._attemptConnection()
			.then(status => console.log("successfully connected: ", status))
			.catch(error => console.log("connection failed: ", error));
	}

	private async _attemptConnection(): Promise<ConnectionStatus> {
		return new Promise((resolve, reject) => {
			console.log("attempt to connect to server");
			this._apiBridge.connect();

			this._apiBridge
				.checkConnection()
				.then(connection => {
					if (connection.status === Response.Ok) {
						resolve(connection);
					} else {
						reject(connection);
					}
				})
				.catch(error => {
					resolve(error);
				});
		});
	}

	protected fetchCurrentPath(): string {
		return "/";
	}
}
