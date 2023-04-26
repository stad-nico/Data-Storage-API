import { DropTarget } from "src/client/common/ui/DropTarget";
import { Component } from "../../Component";
import { HTMLElementComponent } from "../HTMLElementComponent";
import { APIBridge } from "src/APIBridge";
import { EventEmitter } from "common/EventEmitter";

export class CollapsableDirectoryTreeItemBody extends HTMLElementComponent<"main"> {
	public static readonly identifier: string = "CollapsableDirectoryTreeItemBody";

	constructor(apiBridge: APIBridge, eventEmitter: EventEmitter, parent: Component) {
		super(apiBridge, eventEmitter, "main", {
			identifier: CollapsableDirectoryTreeItemBody.identifier,
			classes: [CollapsableDirectoryTreeItemBody.identifier],
			parent: parent,
		});

		new DropTarget(this._htmlElement, () => console.log("DROP"));
	}
}
