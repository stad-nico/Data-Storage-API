import { BrowserApplication } from "browser/BrowserApplication";
import { Application } from "common/Application";
import { Socket } from "common/Socket";
import { Layout } from "common/ui/Layout";
import { Theme } from "common/ui/Theme";

var browserApplication = new BrowserApplication(Layout.Floating, Theme.Light, new Socket());

globalThis.application = browserApplication;
console.log(globalThis.application);

declare global {
	var application: Application;
}
