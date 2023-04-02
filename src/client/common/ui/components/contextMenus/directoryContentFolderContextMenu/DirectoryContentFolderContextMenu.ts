import { DeleteIcon24 } from "src/client/common/ui/components/icons/24/DeleteIcon24.js";
import { HTMLElementComponent } from "../../HTMLElementComponent.js";
import { ContextMenuElement } from "./ContextMenuElement.js";
import { Hotkey } from "src/client/common/hotkeys/Hotkey.js";
import { DownloadIcon24 } from "src/client/common/ui/components/icons/24/DownloadIcon24.js";

export class DirectoryContentFolderContextMenu extends HTMLElementComponent<"main"> {
	public static readonly identifier: string = "DirectoryContentFolderContextMenu";

	private readonly _parentElement: HTMLElement;

	private readonly _contextMenu: HTMLElementComponent<"main">;

	constructor(parent: HTMLElement, x: number, y: number) {
		super("main", {
			identifier: DirectoryContentFolderContextMenu.identifier,
			classes: [DirectoryContentFolderContextMenu.identifier, "ContextMenuWrapper"],
		});

		this._parentElement = parent;

		this._contextMenu = HTMLElementComponent.fromOptionsAsMultipleParameters("main", "ContextMenu", ["ContextMenu"], this);

		new ContextMenuElement(this._contextMenu, new DownloadIcon24(), "Properties", new Hotkey());
		new ContextMenuElement(this._contextMenu, new DownloadIcon24(), "Properties", new Hotkey());
		new ContextMenuElement(this._contextMenu, new DownloadIcon24(), "Properties", new Hotkey());
		new ContextMenuElement(this._contextMenu, new DeleteIcon24(), "Delete", new Hotkey());

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
