import { EventEmitter } from "common/EventEmitter";
import { Component } from "common/ui/Component";
import { DropTarget } from "common/ui/DropTarget";
import { DirectoryContentElement, DirectoryContentElementType } from "common/ui/components/directoryContentsCollection/DirectoryContentElement";
import { DirectoryContentFolderContextMenu } from "common/ui/components/contextMenus/directoryContentFolderContextMenu/DirectoryContentFolderContextMenu";
import { FolderIcon } from "./FolderIcon";
import { Event } from "common/ui/Event";
import { FrontendToBackendEvent } from "src/APIEvents";
import { APIBridge } from "src/APIBridge";

export class DirectoryContentFolder extends DirectoryContentElement {
	public static readonly identifier: string = "DirectoryContentFolder";

	private _folderIcon: FolderIcon;

	constructor(
		apiBridge: APIBridge,
		eventEmitter: EventEmitter,
		parent: Component,
		name: string,
		lastEdited: Date,
		id: number,
		relativePath: string
	) {
		super(apiBridge, eventEmitter, {
			name: name,
			lastEdited: lastEdited,
			type: DirectoryContentElementType.Folder,
			identifier: DirectoryContentFolder.identifier,
			classes: [DirectoryContentFolder.identifier],
			parent: parent,
			id: id,
			relativePath: relativePath,
		});

		new DropTarget(this._htmlElement, () => {
			console.log("DroP");
			eventEmitter.fire(Event.DirectoryContentElementSelectedById, this.id);
		});

		this._createIconComponent();

		this.addEventListener("contextmenu", this._openContextMenu.bind(this));
	}

	protected override _onSelect(e: MouseEvent): void {
		if (this._selected) {
			this._eventEmitter.fire(Event.DirectoryContentFolderElementOpened, this);
		}
	}

	protected _createIconComponent() {
		this._folderIcon = new FolderIcon(this._apiBridge, this._eventEmitter, {
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

		var contextMenu: DirectoryContentFolderContextMenu = new DirectoryContentFolderContextMenu(
			this._apiBridge,
			this._eventEmitter,
			document.body,
			e.clientX,
			e.clientY
		);

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
