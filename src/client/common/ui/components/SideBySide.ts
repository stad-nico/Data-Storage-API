import { EventEmitter } from "../../EventEmitter.js";
import { Component } from "../Component.js";
import { DirectoryContentsCollection } from "./directoryContentsCollection/DirectoryContentsCollection.js";
import { DirectoryTree } from "./directoryTree/DirectoryTree.js";
import { HTMLElementComponent } from "./HTMLElementComponent.js";

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
