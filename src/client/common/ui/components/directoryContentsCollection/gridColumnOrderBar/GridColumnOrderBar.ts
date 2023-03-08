import { Component } from "../../../Component.js";
import { HTMLElementComponent } from "../../HTMLElementComponent.js";
import { DraggableGridColumnHeader } from "./DraggableGridColumnHeader.js";
import { EventEmitter } from "src/client/common/EventEmitter.js";
import { toKebabCase } from "src/client/common/string.js";

export class GridColumnOrderBar extends HTMLElementComponent<"header"> {
	public static readonly identifier: string = "GridColumnOrderBar";

	private _headings: DraggableGridColumnHeader[];

	private _eventEmitter: EventEmitter;

	constructor(parent: Component) {
		super("header", {
			identifier: GridColumnOrderBar.identifier,
			classes: [GridColumnOrderBar.identifier],
			parent: parent,
		});

		this._eventEmitter = new EventEmitter();
		this._eventEmitter.on("set", this._setColumn.bind(this));

		this._headings = [
			new DraggableGridColumnHeader(this, "Name", this._eventEmitter),
			new DraggableGridColumnHeader(this, "Last edited", this._eventEmitter),
			new DraggableGridColumnHeader(this, "Size", this._eventEmitter),
			new DraggableGridColumnHeader(this, "Icons", this._eventEmitter),
		];
	}

	private _setColumn(event: { data: { index: number; identifier: string } }) {
		let numberStrings = ["first", "second", "third", "fourth"];

		for (let key in this._htmlElement.dataset) {
			if (this._htmlElement.dataset[key] === toKebabCase(event.data.identifier)) {
				console.log(key);
				this.removeAttribute("data-" + toKebabCase(key));
			}
		}
		this.setAttribute(`data-${numberStrings[event.data.index - 1]}-column`, toKebabCase(event.data.identifier));
	}
}
