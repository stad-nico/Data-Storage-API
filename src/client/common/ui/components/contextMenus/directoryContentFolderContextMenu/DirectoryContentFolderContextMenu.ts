import { DeleteIcon24 } from "src/client/common/ui/components/icons/24/DeleteIcon24";
import { HTMLElementComponent } from "../../HTMLElementComponent";
import { ContextMenuElement } from "./ContextMenuElement";
import { Hotkey } from "src/client/common/hotkeys/Hotkey";
import { DownloadIcon24 } from "src/client/common/ui/components/icons/24/DownloadIcon24";
import { APIBridge } from "src/APIBridge";
import { EventEmitter } from "common/EventEmitter";

export class DirectoryContentFolderContextMenu extends HTMLElementComponent<"main"> {
	public static readonly identifier: string = "DirectoryContentFolderContextMenu";

	private readonly _parentElement: HTMLElement;

	private readonly _contextMenu: HTMLElementComponent<"main">;

	constructor(apiBridge: APIBridge, eventEmitter: EventEmitter, parent: HTMLElement, x: number, y: number) {
		super(apiBridge, eventEmitter, "main", {
			identifier: DirectoryContentFolderContextMenu.identifier,
			classes: [DirectoryContentFolderContextMenu.identifier, "ContextMenuWrapper"],
		});

		this._parentElement = parent;

		this._contextMenu = HTMLElementComponent.fromOptionsAsMultipleParameters(
			this._apiBridge,
			this._eventEmitter,
			"main",
			"ContextMenu",
			["ContextMenu"],
			this
		);

		new ContextMenuElement(
			this._apiBridge,
			this._eventEmitter,
			this._contextMenu,
			new DownloadIcon24(this._apiBridge, this._eventEmitter),
			"Properties",
			new Hotkey()
		);
		new ContextMenuElement(
			this._apiBridge,
			this._eventEmitter,
			this._contextMenu,
			new DownloadIcon24(this._apiBridge, this._eventEmitter),
			"Properties",
			new Hotkey()
		);
		new ContextMenuElement(
			this._apiBridge,
			this._eventEmitter,
			this._contextMenu,
			new DownloadIcon24(this._apiBridge, this._eventEmitter),
			"Properties",
			new Hotkey()
		);
		new ContextMenuElement(
			this._apiBridge,
			this._eventEmitter,
			this._contextMenu,
			new DeleteIcon24(this._apiBridge, this._eventEmitter),
			"Delete",
			new Hotkey()
		);

		this._parentElement.append(this.build());

		let width = this._contextMenu.getHTMLElement().getBoundingClientRect().width;

		if (x + width <= window.innerWidth) {
			this._contextMenu.setAttribute("style", `left: ${x}px; top: ${y}px`);
		} else {
			this._contextMenu.setAttribute("style", `left: ${window.innerWidth - width}px; top: ${y}px`);
		}
	}

	/**
	 * removes this contextmenu from the webpage
	 */
	public remove(): void {
		this._parentElement.removeChild(this.getHTMLElement());
	}
}
