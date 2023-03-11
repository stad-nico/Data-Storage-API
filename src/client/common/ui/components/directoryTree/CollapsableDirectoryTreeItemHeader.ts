import { Component } from "../../Component.js";
import { RoundedContainer } from "../roundedContainer/RoundedContainer.js";
import { HTMLElementComponent } from "../HTMLElementComponent.js";

export class CollapsableDirectoryTreeItemHeader extends RoundedContainer<"header"> {
	public static readonly identifier: string = "CollapsableDirectoryTreeItemHeader";

	private readonly _nameComponent: HTMLElementComponent<"div">;
	private readonly _iconWrapper: HTMLElementComponent<"div">;

	constructor(parent: Component) {
		super("header", {
			identifier: CollapsableDirectoryTreeItemHeader.identifier,
			classes: [CollapsableDirectoryTreeItemHeader.identifier],
			parent: parent,
		});

		this._nameComponent = HTMLElementComponent.fromOptionsAsMultipleParameters("div", "Name", ["Name"], this);
		this._iconWrapper = HTMLElementComponent.fromOptionsAsMultipleParameters("div", "IconWrapper", ["IconWrapper"], this);
	}
}
