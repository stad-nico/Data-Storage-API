import { EventEmitter } from "src/client/common/EventEmitter";
import { Component } from "../../Component";
import { HTMLElementComponent } from "../HTMLElementComponent";
import { CollapsableDirectoryTreeItem } from "./CollapsableDirectoryTreeItem";
import { APIBridge } from "src/APIBridge";
import { BackendToFrontendEvent, FrontendToBackendEvent } from "src/APIEvents";
import { DirectoryContentType } from "src/DirectoryContentType";
import { DirectoryContentFolder } from "src/DirectoryContentFolder";
import { DirectoryContentFile } from "src/DirectoryContentFile";

export class DirectoryTree extends HTMLElementComponent<"section"> {
	public static readonly identifier: string = "DirectoryTree";

	private readonly _rootTreeItem: CollapsableDirectoryTreeItem;

	constructor(apiBridge: APIBridge, eventEmitter: EventEmitter, parent: Component) {
		super(apiBridge, eventEmitter, "section", {
			identifier: DirectoryTree.identifier,
			classes: [DirectoryTree.identifier],
			parent: parent,
		});

		this._rootTreeItem = new CollapsableDirectoryTreeItem(apiBridge, eventEmitter, "File Server", this, false);

		this._apiBridge.on(BackendToFrontendEvent.ConnectedToServer, () => {
			this._apiBridge
				.fire(FrontendToBackendEvent.GetDirectoryContents, {
					path: "/",
					contentType: DirectoryContentType.Folder,
				})
				.then((data: DirectoryContentFolder[]) => this._displayElements(data));
		});
	}

	private _displayElements(data: DirectoryContentFolder[]) {
		for (let element of data) {
			let folder: CollapsableDirectoryTreeItem = new CollapsableDirectoryTreeItem(
				this._apiBridge,
				this._eventEmitter,
				element.name,
				this._rootTreeItem.getBodyComponent(),
				true
			);
		}

		this.build();
	}
}
