import { Component } from "../../Component.js";
import { HTMLElementComponent } from "../HTMLElementComponent.js";
import { CollapsableDirectoryTreeItem } from "./CollapsableDirectoryTreeItem.js";

export class DirectoryTree extends HTMLElementComponent<"section"> {
	public static readonly identifier: string = "DirectoryTree";

	private readonly _rootTreeItem: CollapsableDirectoryTreeItem;

	constructor(parent: Component) {
		super("section", {
			identifier: DirectoryTree.identifier,
			classes: [DirectoryTree.identifier],
			parent: parent,
		});

		this._rootTreeItem = new CollapsableDirectoryTreeItem(this);
	}
}
