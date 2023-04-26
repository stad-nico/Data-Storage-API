import { EventEmitter } from "common/EventEmitter";
import { withByteSizeSuffix } from "common/number";
import { Component } from "common/ui/Component";
import { DirectoryContentElement, DirectoryContentElementType } from "common/ui/components/directoryContentsCollection/DirectoryContentElement";
import { HTMLElementComponent } from "common/ui/components/HTMLElementComponent";
import { APIBridge } from "src/APIBridge";

type Extension = "txt";

export class DirectoryContentFile extends DirectoryContentElement {
	public static readonly identifier: string = "DirectoryContentFile";

	private _extension: Extension;
	private _size: number;

	private _extensionComponent: HTMLElementComponent<"span">;
	private _sizeComponent: HTMLElementComponent<"p">;

	constructor(
		apiBridge: APIBridge,
		eventEmitter: EventEmitter,
		parent: Component,
		name: string,
		extension: Extension,
		size: number,
		lastEdited: Date,
		id: number
	) {
		super(apiBridge, eventEmitter, {
			name: name,
			lastEdited: lastEdited,
			type: DirectoryContentElementType.File,
			identifier: DirectoryContentFile.identifier,
			classes: [DirectoryContentFile.identifier],
			parent: parent,
			id: id,
		});

		this._extension = extension;
		this._size = size;

		this._createExtensionComponent();
		this._createSizeComponent();
	}

	protected override _onSelect(e: MouseEvent): void {}

	private _createExtensionComponent(): void {
		this._extensionComponent = HTMLElementComponent.fromOptionsAsMultipleParameters(
			this._apiBridge,
			this._eventEmitter,
			"span",
			"Extension",
			["Extension"],
			this.getNameComponent()
		);

		this._extensionComponent.innerText("." + this._extension);
	}

	private _createSizeComponent(): void {
		this._sizeComponent = HTMLElementComponent.fromOptionsAsMultipleParameters(this._apiBridge, this._eventEmitter, "p", "Size", ["Size"]);
		this.insertAfter(this.getLastEditedComponent(), this._sizeComponent);
		this._sizeComponent.innerText(withByteSizeSuffix(this._size));
	}
}
