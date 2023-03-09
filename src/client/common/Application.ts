import { ServiceCollection } from "src/client/common/services/Service.js";
import { UserInterfaceService, IUserInterfaceService } from "src/client/common/services/UserInterfaceService.js";
import { Layout } from "src/client/common/ui/Layout.js";
import { Theme } from "./ui/Theme.js";

export interface IApplication {
	userInterfaceService: IUserInterfaceService;
}

export abstract class Application extends ServiceCollection implements IApplication {
	/**
	 * UserInterfaceService that handles ui (events & creation)
	 */
	public userInterfaceService: IUserInterfaceService;

	/**
	 * Creates a new Application instance
	 */
	protected constructor(layout: Layout, theme: Theme) {
		super();

		this.userInterfaceService = new UserInterfaceService(layout, theme);
		this.registerService(this.userInterfaceService);
	}
}
