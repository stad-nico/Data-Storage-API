import { Component } from "../Component.js";
import { HTMLElementComponent, HTMLElementComponentOptions } from "./HTMLElementComponent.js";

interface SVGIconOptions extends HTMLElementComponentOptions {
	parent: Component;
	dpath: string;
}

export class SVGIcon extends HTMLElementComponent<any> {
	public static readonly identifier: string = "SVGIcon";

	constructor(options: SVGIconOptions) {
		super(document.createElementNS("http://www.w3.org/2000/svg", "svg"), {
			identifier: options?.identifier || SVGIcon.identifier,
			classes: options?.classes ? options.classes.concat([SVGIcon.identifier, "Icon"]) : [SVGIcon.identifier, "Icon"],
			parent: options?.parent,
		});

		this._htmlElement.setAttributeNS(null, "viewBox", "0 0 24 24");
		this._htmlElement.setAttributeNS(null, "width", "24");
		this._htmlElement.setAttributeNS(null, "height", "24");

		let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path.setAttribute("d", options.dpath);

		this._htmlElement.append(path);
	}
}
