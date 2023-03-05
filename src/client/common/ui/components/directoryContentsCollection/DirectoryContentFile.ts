import { withByteSizeSuffix } from "../../../number.js";
import { toDDMMYYYYWithLeadingZeros } from "../../../string.js";
import { Component } from "../../Component.js";
import { DirectoryContentElement } from "./DirectoryContentElement.js";
import { HTMLElementComponent } from "../HTMLElementComponent.js";

export class DirectoryContentFile extends DirectoryContentElement {
	public static identifier: string = "DirectoryContentFile";

	private _extension: string;
	private _size: number;

	private _extensionComponent: HTMLElementComponent<"span">;
	private _sizeComponent: HTMLElementComponent<"p">;

	constructor(parent: Component, name: string, extension: string, size: number, lastEdited: Date) {
		super(name, lastEdited, {
			identifier: DirectoryContentFile.identifier,
			classes: [DirectoryContentFile.identifier],
			parent: parent,
		});

		this._extension = extension;
		this._size = size;

		this._createExtensionComponent();
		this._createSizeComponent();
	}

	private _createExtensionComponent(): void {
		this._extensionComponent = new HTMLElementComponent("span", {
			identifier: "Extension",
			classes: ["Extension"],
			parent: this.getNameComponent(),
		});

		this._extensionComponent.innerText("." + this._extension);
	}

	private _createSizeComponent(): void {
		this._sizeComponent = new HTMLElementComponent("p", {
			identifier: "Size",
			classes: ["Size", "IconMenu"],
			parent: this,
		});

		this._sizeComponent.innerText(withByteSizeSuffix(this._size));
	}
}
