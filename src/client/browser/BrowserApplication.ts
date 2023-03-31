import { Application, IApplication } from "src/client/common/Application.js";
import { Layout } from "src/client/common/ui/Layout.js";
import { Environment } from "../common/Environment.js";
import { Theme } from "../common/ui/Theme.js";

export interface IBrowserApplication extends IApplication {}

export class BrowserApplication extends Application implements IBrowserApplication {
	/**
	 * Creates a new BrowserApplication instance
	 */
	constructor(layout: Layout, theme: Theme) {
		super(layout, theme, Environment.Browser);
	}
}
