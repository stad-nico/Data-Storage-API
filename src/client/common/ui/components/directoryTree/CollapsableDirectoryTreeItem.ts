import { Component } from "../../Component.js";
import { HTMLElementComponent } from "../HTMLElementComponent.js";
import { CollapsableDirectoryTreeItemHeader } from "./CollapsableDirectoryTreeItemHeader.js";
import { CollapsableDirectoryTreeItemBody } from "./CollapsableDirectoryTreeItemBody.js";
import { EventEmitter } from "src/client/common/EventEmitter.js";
import { DropTarget } from "../../DropTarget.js";
import { Draggable } from "../../Draggable.js";

export class CollapsableDirectoryTreeItem extends HTMLElementComponent<"div"> {
	public static readonly identifier: string = "CollapsableDirectoryTreeItem";

	private _subItems: CollapsableDirectoryTreeItem[];

	private _headerComponent: CollapsableDirectoryTreeItemHeader;
	private _bodyComponent: CollapsableDirectoryTreeItemBody;

	private _name: string;
	private _collapsed: boolean;

	private _eventEmitter: EventEmitter;

	constructor(name: string, parent: Component, eventEmitter: EventEmitter, collapsed: boolean = true) {
		super("div", {
			identifier: CollapsableDirectoryTreeItem.identifier,
			classes: [CollapsableDirectoryTreeItem.identifier],
			parent: parent,
		});

		this._name = name;
		this._collapsed = collapsed;
		this._eventEmitter = eventEmitter;

		this._headerComponent = new CollapsableDirectoryTreeItemHeader(this._name, this);
		this._headerComponent.setOnCollapsableArrowIconClickHandler(this._onCollapsableArrowIconClick.bind(this));
		this._bodyComponent = new CollapsableDirectoryTreeItemBody(this);

		new DropTarget(this._htmlElement, () => console.log("DROP"));

		if (this._collapsed) {
			this.collapse();
		} else {
			this.unfold();
		}
	}

	private _onCollapsableArrowIconClick(): void {
		if (this._collapsed) {
			this.unfold();
		} else {
			this.collapse();
		}
	}

	public collapse(): void {
		this.addClassName("collapsed");
		this._collapsed = true;
	}

	public unfold(): void {
		this.removeClassName("collapsed");
		this._collapsed = false;
	}
}
