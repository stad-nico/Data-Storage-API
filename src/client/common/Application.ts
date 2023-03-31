import { UserInterfaceService } from "src/client/common/services/UserInterfaceService.js";
import { Layout } from "src/client/common/ui/Layout.js";
import { Environment } from "./Environment.js";
import { Theme } from "./ui/Theme.js";

export interface IApplication {
	readonly userInterfaceService: UserInterfaceService;
	readonly environment: Environment;
}

export abstract class Application implements IApplication {
	/**
	 * The environment
	 */
	public readonly environment: Environment;

	/**
	 * UserInterfaceService that handles ui (events & creation)
	 */
	public readonly userInterfaceService: UserInterfaceService;

	/**
	 * Creates a new Application instance
	 */
	protected constructor(layout: Layout, theme: Theme, environment: Environment) {
		this.environment = environment;

		this.userInterfaceService = new UserInterfaceService(layout, theme);
	}
}
