import { BrowserApplication } from "src/client/browser/BrowserApplication.js";
import { Layout } from "src/client/common/ui/Layout.js";
import { Theme } from "./ui/Theme.js";

let browserApplication = new BrowserApplication(Layout.Floating, Theme.Light);

globalThis.application = browserApplication;
console.log(globalThis.application);
