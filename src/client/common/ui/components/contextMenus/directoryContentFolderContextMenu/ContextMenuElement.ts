import { Hotkey } from "src/client/common/hotkeys/Hotkey";
import { HTMLElementComponent } from "src/client/common/ui/components/HTMLElementComponent";
import { Component } from "../../../Component";
import { SVGIcon } from "../../SVGIcon";
import { RoundedContainer } from "../../roundedContainer/RoundedContainer";

export class ContextMenuElement extends RoundedContainer<"div"> {
	public static readonly identifier: string = "ContextMenuElement";

	private readonly icon: SVGIcon;
	private title: string;
	private hotkey: Hotkey;

	private titleComponent: HTMLElementComponent<"p">;
	private hotkeyComponent: HTMLElementComponent<"p">;

	constructor(parent: Component, icon: SVGIcon, title: string, hotkey: Hotkey) {
		super("div", {
			identifier: ContextMenuElement.identifier,
			classes: [ContextMenuElement.identifier, title],
			parent: parent,
		});

		this.icon = icon;
		this.title = title;
		this.hotkey = hotkey;

		this.icon.setParent(this);

		this.titleComponent = new HTMLElementComponent("p", {
			identifier: "Title",
			classes: ["Title"],
			parent: this,
		});
		this.titleComponent.innerText(this.title);

		this.hotkeyComponent = new HTMLElementComponent("p", {
			identifier: "Hotkey",
			classes: ["Hotkey"],
			parent: this,
		});
		this.hotkeyComponent.innerText(this.hotkey.toString());
	}
}
