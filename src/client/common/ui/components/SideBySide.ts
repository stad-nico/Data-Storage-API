import { APIEventEmitter } from "common/APIEventEmitter";
import { EventEmitter } from "common/EventEmitter";
import { Component } from "common/ui/Component";
import { DirectoryContentsCollection } from "common/ui/components/directoryContentsCollection/DirectoryContentsCollection";
import { DirectoryTree } from "common/ui/components/directoryTree/DirectoryTree";
import { HTMLElementComponent } from "common/ui/components/HTMLElementComponent";
import { APIBridge } from "src/APIBridge";

export class SideBySide extends HTMLElementComponent<"main"> {
	public static readonly identifier: string = "SideBySide";

	private readonly _treeStructureComponent: DirectoryTree;

	private readonly _directoryContents: DirectoryContentsCollection;

	constructor(apiBridge: APIBridge, eventEmitter: EventEmitter, parent: Component) {
		super(apiBridge, eventEmitter, "main", {
			identifier: SideBySide.identifier,
			classes: [SideBySide.identifier],
			parent: parent,
		});

		this._treeStructureComponent = new DirectoryTree(apiBridge, eventEmitter, this);
		this._directoryContents = new DirectoryContentsCollection(apiBridge, eventEmitter, this);
	}
}
