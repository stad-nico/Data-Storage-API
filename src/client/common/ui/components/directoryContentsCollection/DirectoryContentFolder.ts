import { Component } from "../../Component.js";
import { DirectoryContentElement } from "./DirectoryContentElement.js";

export class DirectoryContentFolder extends DirectoryContentElement {
	public static readonly identifier: string = "DirectoryContentFolder";

	constructor(parent: Component, name: string, lastEdited: Date) {
		super({
			name: name,
			lastEdited: lastEdited,
			type: "folder",
			identifier: DirectoryContentFolder.identifier,
			classes: [DirectoryContentFolder.identifier],
			parent: parent,
		});
	}
}
