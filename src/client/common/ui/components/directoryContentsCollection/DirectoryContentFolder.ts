import { EventEmitter } from "src/client/common/EventEmitter.js";
import { Component } from "../../Component.js";
import { DropTarget } from "../../DropTarget.js";
import { DirectoryContentElement } from "./DirectoryContentElement.js";
import { DirectoryContentFolderContextMenu } from "../contextMenus/directoryContentFolderContextMenu/DirectoryContentFolderContextMenu.js";
import { FolderIcon } from "./FolderIcon.js";

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
			eventEmitter.fire("select-by-id", this._id);
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
