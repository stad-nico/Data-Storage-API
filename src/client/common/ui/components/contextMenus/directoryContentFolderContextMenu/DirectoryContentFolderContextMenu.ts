import { HTMLElementComponent } from "../../HTMLElementComponent.js";
import { DownloadIcon } from "../../icons/DownloadIcon.js";
import { ContextMenuElement } from "./ContextMenuElement.js";
import { Hotkey } from "src/client/common/hotkeys/Hotkey.js";

export class DirectoryContentFolderContextMenu extends HTMLElementComponent<"main"> {
	public static readonly identifier: string = "DirectoryContentFolderContextMenu";

	private readonly _parentElement: HTMLElement;

	constructor(parent: HTMLElement, x: number, y: number) {
		super("main", {
			identifier: DirectoryContentFolderContextMenu.identifier,
			classes: [DirectoryContentFolderContextMenu.identifier],
		});

		this._parentElement = parent;

		let propertyComponent: ContextMenuElement = new ContextMenuElement(this, new DownloadIcon(), "Properties", new Hotkey());

		this._parentElement.append(this.build());

		this._htmlElement.setAttribute("style", `left: ${x}px; top: ${y}px`);
	}

	/**
	 * removes this contextmenu from the webpage
	 */
	public remove(): void {
		this._parentElement.removeChild(this.getHTMLElement());
	}
}
