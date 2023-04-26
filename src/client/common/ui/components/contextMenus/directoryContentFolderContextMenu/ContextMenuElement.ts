import { Hotkey } from "src/client/common/hotkeys/Hotkey";
import { HTMLElementComponent } from "src/client/common/ui/components/HTMLElementComponent";
import { Component } from "../../../Component";
import { SVGIcon } from "../../SVGIcon";
import { RoundedContainer } from "../../roundedContainer/RoundedContainer";
import { APIBridge } from "src/APIBridge";
import { EventEmitter } from "common/EventEmitter";

export class ContextMenuElement extends RoundedContainer<"div"> {
	public static readonly identifier: string = "ContextMenuElement";

	private readonly icon: SVGIcon;
	private title: string;
	private hotkey: Hotkey;

	private titleComponent: HTMLElementComponent<"p">;
	private hotkeyComponent: HTMLElementComponent<"p">;

	constructor(apiBridge: APIBridge, eventEmitter: EventEmitter, parent: Component, icon: SVGIcon, title: string, hotkey: Hotkey) {
		super(apiBridge, eventEmitter, "div", {
			identifier: ContextMenuElement.identifier,
			classes: [ContextMenuElement.identifier, title],
			parent: parent,
		});

		this.icon = icon;
		this.title = title;
		this.hotkey = hotkey;

		this.icon.setParent(this);

		this.titleComponent = new HTMLElementComponent(this._apiBridge, this._eventEmitter, "p", {
			identifier: "Title",
			classes: ["Title"],
			parent: this,
		});
		this.titleComponent.innerText(this.title);

		this.hotkeyComponent = new HTMLElementComponent(this._apiBridge, this._eventEmitter, "p", {
			identifier: "Hotkey",
			classes: ["Hotkey"],
			parent: this,
		});
		this.hotkeyComponent.innerText(this.hotkey.toString());
	}
}
