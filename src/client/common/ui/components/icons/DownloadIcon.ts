import { SVGIcon } from "../SVGIcon.js";
import { Component } from "src/client/common/ui/Component.js";

export class DownloadIcon extends SVGIcon {
	public static readonly identifier: string = "DownloadIcon";

	constructor(parent?: Component) {
		super({
			identifier: DownloadIcon.identifier,
			classes: [DownloadIcon.identifier],
			parent: parent,
			dpath: "M6 20q-.825 0-1.412-.587Q4 18.825 4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413Q18.825 20 18 20Zm6-4-5-5 1.4-1.45 2.6 2.6V4h2v8.15l2.6-2.6L17 11Z",
		});
	}
}
