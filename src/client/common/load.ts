import { BrowserApplication } from "src/client/browser/BrowserApplication.js";
import { Layout } from "src/client/common/ui/Layout.js";

let browserApplication = new BrowserApplication(Layout.Floating);

globalThis.application = browserApplication;
console.log(globalThis.application);
