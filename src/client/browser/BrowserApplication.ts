import { Application, IApplication } from "src/client/common/Application";
import { Layout } from "src/client/common/ui/Layout";
import { Environment } from "../common/Environment";
import { Theme } from "../common/ui/Theme";

export interface IBrowserApplication extends IApplication {}

export class BrowserApplication extends Application implements IBrowserApplication {
	/**
	 * Creates a new BrowserApplication instance
	 */
	constructor(layout: Layout, theme: Theme) {
		super(layout, theme, Environment.Browser);
	}
}
