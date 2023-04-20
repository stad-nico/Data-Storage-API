import { DropTarget } from "src/client/common/ui/DropTarget";
import { Component } from "../../Component";
import { HTMLElementComponent } from "../HTMLElementComponent";

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
