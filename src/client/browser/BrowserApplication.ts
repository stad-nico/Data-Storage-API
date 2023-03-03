import { Application, IApplication } from "src/client/common/Application.js";
import { LayoutType } from "src/client/common/ui/Layout.js";

export interface IBrowserApplication extends IApplication {}

export class BrowserApplication extends Application implements IBrowserApplication {
	/**
	 * Creates a new BrowserApplication instance
	 */
	constructor(layoutType: LayoutType) {
		super(layoutType);
	}
}
