import { EventEmitter } from "src/client/common/EventEmitter.js";
import { Component } from "../../Component.js";
import { DirectoryContentElement } from "./DirectoryContentElement.js";

export class DirectoryContentFolder extends DirectoryContentElement {
	public static readonly identifier: string = "DirectoryContentFolder";

	constructor(eventEmitter: EventEmitter, parent: Component, name: string, lastEdited: Date) {
		super(eventEmitter, {
			name: name,
			lastEdited: lastEdited,
			type: "folder",
			identifier: DirectoryContentFolder.identifier,
			classes: [DirectoryContentFolder.identifier],
			parent: parent,
		});
	}
}
