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

	private _selectedItem: CollapsableDirectoryTreeItem;

	constructor(apiBridge: APIBridge, eventEmitter: EventEmitter, parent: Component) {
		super(apiBridge, eventEmitter, "section", {
			identifier: DirectoryTree.identifier,
			classes: [DirectoryTree.identifier],
			parent: parent,
		});

		this._apiBridge.on(BackendToFrontendEvent.ConnectedToServer, () => {
			this._rootTreeItem = new CollapsableDirectoryTreeItem(apiBridge, eventEmitter, "File Server", "/", this, [], false);
			this.build();
		});

		this._eventEmitter.on(Event.TreeFolderItemOpened, data => this._selectItem(data.data));
	}

	private _selectItem(component: CollapsableDirectoryTreeItem): void {
		if (this._selectedItem) {
			this._selectedItem.unselect();
		}

		component.select();
		this._selectedItem = component;
	}
}
