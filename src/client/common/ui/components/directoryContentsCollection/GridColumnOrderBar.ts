import { Component } from "../../Component.js";
import { HTMLElementComponent } from "../HTMLElementComponent.js";

export class GridColumnOrderBar extends HTMLElementComponent<"header"> {
	public static readonly identifier: string = "GridColumnOrderBar";

	private _nameComponent: HTMLElementComponent<"div">;
	private _lastEditedComponent: HTMLElementComponent<"div">;
	private _sizeComponent: HTMLElementComponent<"div">;
	private _iconsComponent: HTMLElementComponent<"div">;

	constructor(parent: Component) {
		super("header", {
			identifier: GridColumnOrderBar.identifier,
			classes: [GridColumnOrderBar.identifier],
			parent: parent,
		});

		this._nameComponent = HTMLElementComponent.fromOptionsAsMultipleParameters("div", "", ["ColumnHeading"], this);
		this._nameComponent.innerText("Name");
		this._lastEditedComponent = HTMLElementComponent.fromOptionsAsMultipleParameters("div", "", ["ColumnHeading"], this);
		this._lastEditedComponent.innerText("Last Edited");
		this._sizeComponent = HTMLElementComponent.fromOptionsAsMultipleParameters("div", "", ["ColumnHeading"], this);
		this._sizeComponent.innerText("Size");
		this._iconsComponent = HTMLElementComponent.fromOptionsAsMultipleParameters("div", "", ["ColumnHeading"], this);
		this._iconsComponent.innerText("Icons");
	}
}
