import { DropTarget } from "src/client/common/ui/DropTarget.js";
import { Component } from "../../Component.js";
import { HTMLElementComponent } from "../HTMLElementComponent.js";

export class CollapsableDirectoryTreeItemBody extends HTMLElementComponent<"main"> {
	public static readonly identifier: string = "CollapsableDirectoryTreeItemBody";

	constructor(parent: Component) {
		super("main", {
			identifier: CollapsableDirectoryTreeItemBody.identifier,
			classes: [CollapsableDirectoryTreeItemBody.identifier],
			parent: parent,
		});

		new DropTarget(this._htmlElement, () => console.log("DROP"));
	}
}
