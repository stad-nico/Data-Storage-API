import { Component } from "../../Component.js";
import { HTMLElementComponent } from "../HTMLElementComponent.js";
import { CollapsableDirectoryTreeItemHeader } from "./CollapsableDirectoryTreeItemHeader.js";
import { CollapsableDirectoryTreeItemBody } from "./CollapsableDirectoryTreeItemBody.js";

export class CollapsableDirectoryTreeItem extends HTMLElementComponent<"div"> {
	public static readonly identifier: string = "CollapsableDirectoryTreeItem";

	private _subItems: CollapsableDirectoryTreeItem[];

	private _headerComponent: CollapsableDirectoryTreeItemHeader;

	private _bodyComponent: CollapsableDirectoryTreeItemBody;

	constructor(parent: Component) {
		super("div", {
			identifier: CollapsableDirectoryTreeItem.identifier,
			classes: [CollapsableDirectoryTreeItem.identifier],
			parent: parent,
		});

		this._headerComponent = new CollapsableDirectoryTreeItemHeader(this);
		this._bodyComponent = new CollapsableDirectoryTreeItemBody(this);
	}
}
