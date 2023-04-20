import { UserInterfaceService } from "common/services/UserInterfaceService";
import { Layout } from "common/ui/Layout";
import { Environment } from "common/Environment";
import { Theme } from "common/ui/Theme";

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
