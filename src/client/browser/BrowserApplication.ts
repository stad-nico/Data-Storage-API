import { Application, IApplication } from "src/client/common/Application";
import { Layout } from "src/client/common/ui/Layout";
import { Environment } from "../common/Environment";
import { Theme } from "../common/ui/Theme";
import { APIBridge } from "src/APIBridge";

export interface IBrowserApplication extends IApplication {}

export class BrowserApplication extends Application implements IBrowserApplication {
	/**
	 * Creates a new BrowserApplication instance
	 */
	constructor(layout: Layout, theme: Theme, apiBridge: APIBridge) {
		super(layout, theme, Environment.Browser, apiBridge);
	}

	protected override fetchCurrentPath(): string {
		// if (this._apiBridge.fire(FrontendToBackendEvent.))
		return window.location.pathname;
	}
}
