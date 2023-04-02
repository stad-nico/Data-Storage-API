import { Component } from "../Component.js";
import { HTMLElementComponent, HTMLElementComponentOptions } from "./HTMLElementComponent.js";

export interface SVGIconOptions extends HTMLElementComponentOptions {
	dpath: string;
}

export abstract class SVGIcon extends HTMLElementComponent<any> {
	public static readonly identifier: string = "SVGIcon";

	constructor(options: SVGIconOptions, width: number = 24, height: number = 24) {
		super(document.createElementNS("http://www.w3.org/2000/svg", "svg"), {
			identifier: options?.identifier || SVGIcon.identifier,
			classes: options?.classes ? options.classes.concat([SVGIcon.identifier, "Icon"]) : [SVGIcon.identifier, "Icon"],
			parent: options?.parent,
		});

		this._htmlElement.setAttributeNS(null, "viewBox", `0 0 ${width} ${height}`);
		this._htmlElement.setAttributeNS(null, "width", width);
		this._htmlElement.setAttributeNS(null, "height", height);

		let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path.setAttribute("d", options.dpath);

		this._htmlElement.append(path);
	}
}
