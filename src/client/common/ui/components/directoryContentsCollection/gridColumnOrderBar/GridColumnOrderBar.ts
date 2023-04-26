import { Event } from "common/ui/Event";
import { Component } from "common/ui/Component";
import { HTMLElementComponent } from "common/ui/components/HTMLElementComponent";
import { DraggableGridColumnHeader } from "common/ui/components/directoryContentsCollection/gridColumnOrderBar/DraggableGridColumnHeader";
import { EventEmitter } from "common/EventEmitter";
import { toKebabCase } from "common/string";
import { APIEventEmitter } from "common/APIEventEmitter";
import { APIBridge } from "src/APIBridge";

export class GridColumnOrderBar extends HTMLElementComponent<"header"> {
	public static readonly identifier: string = "GridColumnOrderBar";

	private _headings: DraggableGridColumnHeader[];

	constructor(apiBridge: APIBridge, eventEmitter: EventEmitter, parent: Component) {
		super(apiBridge, eventEmitter, "header", {
			identifier: GridColumnOrderBar.identifier,
			classes: [GridColumnOrderBar.identifier],
			parent: parent,
		});

		this._eventEmitter.on(Event.DirectoryContentColumnHeaderIndexSet, this._setColumn.bind(this));
		this._eventEmitter.on(Event.DirectoryContentColumnHeaderDropped, this._onDrop.bind(this));

		this._headings = [
			new DraggableGridColumnHeader(apiBridge, eventEmitter, this, "Name"),
			new DraggableGridColumnHeader(apiBridge, eventEmitter, this, "Last edited"),
			new DraggableGridColumnHeader(apiBridge, eventEmitter, this, "Size"),
			new DraggableGridColumnHeader(apiBridge, eventEmitter, this, "Icons"),
		];
	}

	private _setColumn(event: { data: { index: number; identifier: string } }) {
		let numberStrings = ["first", "second", "third", "fourth"];

		for (let key in this._htmlElement.dataset) {
			if (this._htmlElement.dataset[key] === toKebabCase(event.data.identifier)) {
				this.removeAttribute("data-" + toKebabCase(key));
			}
		}
		this.setAttribute(`data-${numberStrings[event.data.index - 1]}-column`, toKebabCase(event.data.identifier));
	}

	private _onDrop(event: { data: { index: number; identifier: string } }) {
		this._setColumn(event);
		this._eventEmitter.fire(Event.DirectoryContentColumnOrderUpdated, this._htmlElement.dataset);

		for (let key in this._htmlElement.dataset) {
			this.removeAttribute("data-" + toKebabCase(key));
		}
	}
}
