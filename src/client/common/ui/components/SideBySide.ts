import { Component } from "../Component.js";
import { DirectoryContentsCollection } from "./directoryContentsCollection/DirectoryContentsCollection.js";
import { DirectoryTree } from "./directoryTree/DirectoryTree.js";
import { HTMLElementComponent } from "./HTMLElementComponent.js";

export class SideBySide extends HTMLElementComponent<"main"> {
	public static readonly identifier: string = "SideBySide";

	private readonly _treeStructureComponent: DirectoryTree;
	private readonly _directoryContents: DirectoryContentsCollection;

	constructor(parent: Component) {
		super("main", {
			identifier: SideBySide.identifier,
			classes: [SideBySide.identifier],
			parent: parent,
		});

		this._treeStructureComponent = new DirectoryTree(this);
		this._directoryContents = new DirectoryContentsCollection(this);
	}
}
