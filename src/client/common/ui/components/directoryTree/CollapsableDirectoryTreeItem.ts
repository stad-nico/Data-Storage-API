import { Component } from "../../Component";
import { HTMLElementComponent } from "../HTMLElementComponent";
import { CollapsableDirectoryTreeItemHeader } from "./CollapsableDirectoryTreeItemHeader";
import { CollapsableDirectoryTreeItemBody } from "./CollapsableDirectoryTreeItemBody";
import { EventEmitter } from "src/client/common/EventEmitter";
import { DropTarget } from "../../DropTarget";
import { Draggable } from "../../Draggable";
import { APIEventEmitter } from "common/APIEventEmitter";
import { APIBridge } from "src/APIBridge";

export class CollapsableDirectoryTreeItem extends HTMLElementComponent<"div"> {
	public static readonly identifier: string = "CollapsableDirectoryTreeItem";

	private _subItems: CollapsableDirectoryTreeItem[];

	private _headerComponent: CollapsableDirectoryTreeItemHeader;
	private _bodyComponent: CollapsableDirectoryTreeItemBody;

	private _name: string;
	private _collapsed: boolean;

	constructor(apiBridge: APIBridge, eventEmitter: EventEmitter, name: string, parent: Component, collapsed: boolean = true) {
		super(apiBridge, eventEmitter, "div", {
			identifier: CollapsableDirectoryTreeItem.identifier,
			classes: [CollapsableDirectoryTreeItem.identifier],
			parent: parent,
		});

		this._name = name;
		this._collapsed = collapsed;

		this._headerComponent = new CollapsableDirectoryTreeItemHeader(apiBridge, eventEmitter, this._name, this);
		this._headerComponent.setOnCollapsableArrowIconClickHandler(this._onCollapsableArrowIconClick.bind(this));
		this._bodyComponent = new CollapsableDirectoryTreeItemBody(apiBridge, eventEmitter, this);

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
