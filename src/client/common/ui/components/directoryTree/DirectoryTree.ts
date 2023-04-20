import { EventEmitter } from "src/client/common/EventEmitter";
import { Component } from "../../Component";
import { HTMLElementComponent } from "../HTMLElementComponent";
import { CollapsableDirectoryTreeItem } from "./CollapsableDirectoryTreeItem";

export class DirectoryTree extends HTMLElementComponent<"section"> {
	public static readonly identifier: string = "DirectoryTree";

	private readonly _rootTreeItem: CollapsableDirectoryTreeItem;

	constructor(parent: Component, eventEmitter: EventEmitter) {
		super("section", {
			identifier: DirectoryTree.identifier,
			classes: [DirectoryTree.identifier],
			parent: parent,
		});

		this._rootTreeItem = new CollapsableDirectoryTreeItem("test", this, eventEmitter, false);
	}
}
