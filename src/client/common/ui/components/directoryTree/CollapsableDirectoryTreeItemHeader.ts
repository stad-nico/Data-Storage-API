import { Component } from "../../Component.js";
import { RoundedContainer } from "../roundedContainer/RoundedContainer.js";
import { HTMLElementComponent } from "../HTMLElementComponent.js";
import { FolderIcon } from "../directoryContentsCollection/FolderIcon.js";
import { CollapsableArrowIcon } from "../icons/CollapsableArrowIcon.js";
import { OpenInNewTabIcon } from "./OpenInNewTabIcon.js";
import { EventEmitter } from "src/client/common/EventEmitter.js";
import { Draggable } from "../../Draggable.js";
import { CollapsableArrowIcon24 } from "../icons/24/CollapsableArrowIcon24.js";
import { DropTarget } from "src/client/common/ui/DropTarget.js";

export class CollapsableDirectoryTreeItemHeader extends RoundedContainer<"header"> {
	public static readonly identifier: string = "CollapsableDirectoryTreeItemHeader";

	private readonly _nameComponent: HTMLElementComponent<"div">;
	private readonly _iconWrapper: HTMLElementComponent<"div">;
	private readonly _folderIcon: FolderIcon;
	private readonly _collapsableArrowIcon: CollapsableArrowIcon;
	private readonly _openInNewTabIcon: OpenInNewTabIcon;

	private readonly _eventEmitter: EventEmitter;

	private _onCollapsableArrowIconClick: (...args: any[]) => void;

	constructor(name: string, parent: Component) {
		super("header", {
			identifier: CollapsableDirectoryTreeItemHeader.identifier,
			classes: [CollapsableDirectoryTreeItemHeader.identifier],
			parent: parent,
		});

		this._collapsableArrowIcon = new CollapsableArrowIcon24(this);
		this._folderIcon = new FolderIcon({ parent: this });
		this._nameComponent = HTMLElementComponent.fromOptionsAsMultipleParameters("div", "Name", ["Name"], this);
		this._nameComponent.innerText(name);
		this._iconWrapper = HTMLElementComponent.fromOptionsAsMultipleParameters("div", "IconWrapper", ["IconWrapper"], this);
		this._openInNewTabIcon = new OpenInNewTabIcon(this._iconWrapper);

		new Draggable(this._htmlElement);
		new DropTarget(this._htmlElement, () => console.log("DROP"));
	}

	public setOnCollapsableArrowIconClickHandler(handler: (...args: any[]) => void) {
		this._collapsableArrowIcon.removeEventListener("click", this._onCollapsableArrowIconClick);
		this._onCollapsableArrowIconClick = handler;
		this._collapsableArrowIcon.addEventListener("click", this._onCollapsableArrowIconClick);
	}
}
