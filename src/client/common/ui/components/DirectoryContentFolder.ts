import { Component } from "../Component.js";
import { HTMLElementComponent } from "./HTMLElementComponent.js";
import { RoundedContainer } from "./RoundedContainer.js";

export class DirectoryContentFolder extends RoundedContainer {
	public static identifier: string = "DirectoryContentFolder";

	private _name: string;

	private _nameComponent: HTMLElementComponent<"p">;

	constructor(parent: Component) {
		super({
			identifier: DirectoryContentFolder.identifier,
			classes: [DirectoryContentFolder.identifier],
			parent: parent,
		});

		this._nameComponent = new HTMLElementComponent("p", {
			identifier: "Name",
			classes: ["Name"],
			parent: this,
		});
	}
}
