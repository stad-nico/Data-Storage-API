import { EventEmitter } from "common/EventEmitter";
import { Component } from "common/ui/Component";
import { DirectoryContentsCollection } from "common/ui/components/directoryContentsCollection/DirectoryContentsCollection";
import { DirectoryTree } from "common/ui/components/directoryTree/DirectoryTree";
import { HTMLElementComponent } from "common/ui/components/HTMLElementComponent";

export class SideBySide extends HTMLElementComponent<"main"> {
	public static readonly identifier: string = "SideBySide";

	private readonly _eventEmitter: EventEmitter;

	private readonly _treeStructureComponent: DirectoryTree;
	private readonly _directoryContents: DirectoryContentsCollection;

	constructor(parent: Component, eventEmitter: EventEmitter) {
		super("main", {
			identifier: SideBySide.identifier,
			classes: [SideBySide.identifier],
			parent: parent,
		});

		this._eventEmitter = eventEmitter;

		this._treeStructureComponent = new DirectoryTree(this, this._eventEmitter);
		this._directoryContents = new DirectoryContentsCollection(this, this._eventEmitter);
	}
}
