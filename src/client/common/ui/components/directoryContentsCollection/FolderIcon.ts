import { HTMLElementComponent, HTMLElementComponentOptions } from "../HTMLElementComponent.js";

/**
 * Doesnt extends SVGIcon because this icon will be implemented with elements
 */
export class FolderIcon extends HTMLElementComponent<"div"> {
	public static readonly identifier: string = "FolderIcon";

	private readonly _front: HTMLElementComponent<"span">;
	private readonly _back: HTMLElementComponent<"div">;
	private readonly _top: HTMLElementComponent<"span">;
	private readonly _basic: HTMLElementComponent<"span">;

	constructor(options?: HTMLElementComponentOptions) {
		super("div", {
			identifier: options?.identifier || FolderIcon.identifier,
			classes: options?.classes ? options?.classes?.concat([FolderIcon.identifier]) : [FolderIcon.identifier],
			parent: options?.parent,
		});

		this._back = HTMLElementComponent.fromOptionsAsMultipleParameters("div", "Back", ["Back"], this);
		this._top = HTMLElementComponent.fromOptionsAsMultipleParameters("span", "Top", ["Top"], this._back);
		this._basic = HTMLElementComponent.fromOptionsAsMultipleParameters("span", "Basic", ["Basic"], this._back);
		this._front = HTMLElementComponent.fromOptionsAsMultipleParameters("span", "Front", ["Front"], this);
	}
}
