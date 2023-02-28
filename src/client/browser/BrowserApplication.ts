import { Application, IApplication } from "src/client/common/Application.js";
import { Layout } from "src/client/common/ui/Layout.js";

export interface IBrowserApplication extends IApplication {}

export class BrowserApplication extends Application implements IBrowserApplication {
	/**
	 * Creates a new BrowserApplication instance
	 */
	constructor(layout: Layout) {
		super(layout);
	}
}
