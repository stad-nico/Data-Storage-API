import { BrowserApplication } from "browser/BrowserApplication";
import { Layout } from "common/ui/Layout";
import { Theme } from "common/ui/Theme";

let browserApplication = new BrowserApplication(Layout.Floating, Theme.Light);

globalThis.application = browserApplication;
console.log(globalThis.application);
