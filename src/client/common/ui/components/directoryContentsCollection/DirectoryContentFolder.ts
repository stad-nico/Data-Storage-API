import { EventEmitter } from "common/EventEmitter";
import { Component } from "common/ui/Component";
import { DropTarget } from "common/ui/DropTarget";
import { DirectoryContentElement } from "common/ui/components/directoryContentsCollection/DirectoryContentElement";
import { DirectoryContentFolderContextMenu } from "common/ui/components/contextMenus/directoryContentFolderContextMenu/DirectoryContentFolderContextMenu";
import { FolderIcon } from "./FolderIcon";
import { Event } from "common/ui/Event";

export class DirectoryContentFolder extends DirectoryContentElement {
	public static readonly identifier: string = "DirectoryContentFolder";

	private _folderIcon: FolderIcon;

	constructor(eventEmitter: EventEmitter, parent: Component, name: string, lastEdited: Date, id: number) {
		super(eventEmitter, {
			name: name,
			lastEdited: lastEdited,
			type: "folder",
			identifier: DirectoryContentFolder.identifier,
			classes: [DirectoryContentFolder.identifier],
			parent: parent,
			id: id,
		});

		new DropTarget(this._htmlElement, () => {
			console.log("DroP");
			eventEmitter.fire(Event.DirectoryContentElementSelectedById, this._id);
		});

		this._createIconComponent();

		this.addEventListener("contextmenu", this._openContextMenu.bind(this));
	}

	protected _createIconComponent() {
		this._folderIcon = new FolderIcon({
			identifier: "FolderIcon",
			classes: ["FolderIcon", "ToggleOnHover"],
		});

		this._iconAndNameWrapperComponent.prependChild(this._folderIcon);
	}

	private _openContextMenu(e: MouseEvent) {
		e.preventDefault();

		if (!this._selected) {
			return;
		}

		var contextMenu: DirectoryContentFolderContextMenu = new DirectoryContentFolderContextMenu(document.body, e.clientX, e.clientY);

		document.addEventListener(
			"mousedown",
			function (e) {
				contextMenu.remove();
			},
			{
				once: true,
			}
		);
	}
}
