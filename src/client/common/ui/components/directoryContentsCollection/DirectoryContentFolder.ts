import { Component } from "../../Component.js";
import { DirectoryContentElement } from "./DirectoryContentElement.js";
import { HTMLElementComponent } from "../HTMLElementComponent.js";

export class DirectoryContentFolder extends DirectoryContentElement {
	public static identifier: string = "DirectoryContentFolder";

	constructor(parent: Component, name: string, lastEdited: Date) {
		super(name, lastEdited, "folder", {
			identifier: DirectoryContentFolder.identifier,
			classes: [DirectoryContentFolder.identifier],
			parent: parent,
		});
	}
}
