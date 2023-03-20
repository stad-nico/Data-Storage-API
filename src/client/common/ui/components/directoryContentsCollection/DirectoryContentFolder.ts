import { EventEmitter } from "src/client/common/EventEmitter.js";
import { Component } from "../../Component.js";
import { Draggable } from "../../Draggable.js";
import { DropTarget } from "../../DropTarget.js";
import { DirectoryContentElement } from "./DirectoryContentElement.js";
import { FolderIcon } from "./FolderIcon.js";

export class DirectoryContentFolder extends DirectoryContentElement {
	public static readonly identifier: string = "DirectoryContentFolder";

	private _folderIcon: FolderIcon;

	constructor(eventEmitter: EventEmitter, parent: Component, name: string, lastEdited: Date) {
		super(eventEmitter, {
			name: name,
			lastEdited: lastEdited,
			type: "folder",
			identifier: DirectoryContentFolder.identifier,
			classes: [DirectoryContentFolder.identifier],
			parent: parent,
		});

		new Draggable(this._htmlElement);
		new DropTarget(this._htmlElement, () => console.log("DroP"));

		this._createIconComponent();
	}

	protected _createIconComponent() {
		this._folderIcon = new FolderIcon({
			identifier: "FolderIcon",
			classes: ["FolderIcon", "ToggleOnHover"],
		});

		this._iconAndNameWrapperComponent.prependChild(this._folderIcon);
	}
}
