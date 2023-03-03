import { BrowserApplication } from "src/client/browser/BrowserApplication.js";
import { LayoutType } from "src/client/common/ui/Layout.js";

let browserApplication = new BrowserApplication(LayoutType.Floating);

globalThis.application = browserApplication;
console.log(globalThis.application);
