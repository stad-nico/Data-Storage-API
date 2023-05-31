import { EventEmitter } from "src/client/common/EventEmitter";
import { Component } from "../../Component";
import { HTMLElementComponent } from "../HTMLElementComponent";
import { CollapsableDirectoryTreeItem } from "./CollapsableDirectoryTreeItem";
import { APIBridge } from "src/APIBridge";
import { BackendToFrontendEvent, FrontendToBackendEvent } from "src/APIEvents";
import { DirectoryContentType } from "src/DirectoryContentType";
import { DirectoryContentFolderRecursive } from "src/DirectoryContentFolderRecursive";
import { Event } from "common/ui/Event";

export class DirectoryTree extends HTMLElementComponent<"section"> {
	public static readonly identifier: string = "DirectoryTree";

	private _rootTreeItem: CollapsableDirectoryTreeItem;

	constructor(apiBridge: APIBridge, eventEmitter: EventEmitter, parent: Component) {
		super(apiBridge, eventEmitter, "section", {
			identifier: DirectoryTree.identifier,
			classes: [DirectoryTree.identifier],
			parent: parent,
		});

		this._apiBridge.on(BackendToFrontendEvent.ConnectedToServer, () => {
			this._rootTreeItem = new CollapsableDirectoryTreeItem(apiBridge, eventEmitter, "File Server", this, [], false);
			this._apiBridge
				.fire(FrontendToBackendEvent.GetDirectoryContentsRecursive, {
					path: "/",
					contentType: DirectoryContentType.Folder,
				})
				.then((data: DirectoryContentFolderRecursive[]) => this._displayElements(data));
		});
	}

	private _displayElements(data: DirectoryContentFolderRecursive[]) {
		for (let element of data) {
			let folder: CollapsableDirectoryTreeItem = new CollapsableDirectoryTreeItem(
				this._apiBridge,
				this._eventEmitter,
				element.name,
				this._rootTreeItem.getBodyComponent(),
				[]
			);

			this._rootTreeItem.addContent(folder);

			for (let contentData of element.contents.filter(x => x.type === DirectoryContentType.Folder)) {
				let content: CollapsableDirectoryTreeItem = new CollapsableDirectoryTreeItem(
					this._apiBridge,
					this._eventEmitter,
					contentData.name,
					folder.getBodyComponent(),
					[]
				);

				folder.addContent(content);
			}
		}

		this.build();
	}
}
