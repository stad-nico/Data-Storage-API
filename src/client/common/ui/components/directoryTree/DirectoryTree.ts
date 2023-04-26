import { EventEmitter } from "src/client/common/EventEmitter";
import { Component } from "../../Component";
import { HTMLElementComponent } from "../HTMLElementComponent";
import { CollapsableDirectoryTreeItem } from "./CollapsableDirectoryTreeItem";
import { APIBridge } from "src/APIBridge";

export class DirectoryTree extends HTMLElementComponent<"section"> {
	public static readonly identifier: string = "DirectoryTree";

	private readonly _rootTreeItem: CollapsableDirectoryTreeItem;

	constructor(apiBridge: APIBridge, eventEmitter: EventEmitter, parent: Component) {
		super(apiBridge, eventEmitter, "section", {
			identifier: DirectoryTree.identifier,
			classes: [DirectoryTree.identifier],
			parent: parent,
		});

		this._rootTreeItem = new CollapsableDirectoryTreeItem(apiBridge, eventEmitter, "test", this, false);
	}
}
