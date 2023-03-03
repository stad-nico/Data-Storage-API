import { Component } from "../Component.js";
import { HTMLElementComponent } from "./HTMLElementComponent.js";
import { RoundedContainer } from "./RoundedContainer.js";

export class DirectoryContentFile extends RoundedContainer {
	public static identifier: string = "DirectoryContentFile";

	private _name: string;
	private _extension: string;
	private _size: number;
	private _lastEdited: Date;

	private _nameComponent: HTMLElementComponent<"p">;
	private _extensionComponent: HTMLElementComponent<"span">;
	private _sizeComponent: HTMLElementComponent<"p">;

	constructor(parent: Component, name: string, extension: string, size: number, lastEdited: Date) {
		super({
			identifier: DirectoryContentFile.identifier,
			classes: [DirectoryContentFile.identifier],
			parent: parent,
		});

		this._name = name;
		this._extension = extension;
		this._size = size;
		this._lastEdited = lastEdited;

		this._createNameComponent();
		this._createExtensionComponent();
		this._createSizeComponent();
	}

	private _createNameComponent(): void {
		this._nameComponent = new HTMLElementComponent("p", {
			identifier: "Name",
			classes: ["Name"],
			parent: this,
		});

		this._nameComponent.innerText(this._name);
	}

	private _createExtensionComponent(): void {
		this._extensionComponent = new HTMLElementComponent("span", {
			identifier: "Extension",
			classes: ["Extension"],
			parent: this._nameComponent,
		});

		this._extensionComponent.innerText("." + this._extension);
	}

	private _createSizeComponent(): void {
		this._sizeComponent = new HTMLElementComponent("p", {
			identifier: "Size",
			classes: ["Size"],
			parent: this,
		});

		this._sizeComponent.innerText(this._size.toString());
	}
}
