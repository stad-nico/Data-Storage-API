import { EventEmitter } from "common/EventEmitter";
import { HTMLElementComponent, HTMLElementComponentOptions } from "common/ui/components/HTMLElementComponent";
import { APIBridge } from "src/APIBridge";

/**
 * Doesnt extends SVGIcon because this icon will be implemented with elements
 */
export class FolderIcon extends HTMLElementComponent<"div"> {
	public static readonly identifier: string = "FolderIcon";

	private readonly _front: HTMLElementComponent<"span">;
	private readonly _back: HTMLElementComponent<"div">;
	private readonly _top: HTMLElementComponent<"span">;
	private readonly _basic: HTMLElementComponent<"span">;

	constructor(apiBridge: APIBridge, eventEmitter: EventEmitter, options?: HTMLElementComponentOptions) {
		super(apiBridge, eventEmitter, "div", {
			identifier: options?.identifier || FolderIcon.identifier,
			classes: options?.classes ? options?.classes?.concat([FolderIcon.identifier]) : [FolderIcon.identifier],
			parent: options?.parent,
		});

		this._back = HTMLElementComponent.fromOptionsAsMultipleParameters(this._apiBridge, this._eventEmitter, "div", "Back", ["Back"], this);
		this._top = HTMLElementComponent.fromOptionsAsMultipleParameters(this._apiBridge, this._eventEmitter, "span", "Top", ["Top"], this._back);
		this._basic = HTMLElementComponent.fromOptionsAsMultipleParameters(
			this._apiBridge,
			this._eventEmitter,
			"span",
			"Basic",
			["Basic"],
			this._back
		);
		this._front = HTMLElementComponent.fromOptionsAsMultipleParameters(this._apiBridge, this._eventEmitter, "span", "Front", ["Front"], this);
	}
}
