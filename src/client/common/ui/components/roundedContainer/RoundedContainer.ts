import { HTMLElementComponent, HTMLElementComponentOptions } from "../HTMLElementComponent.js";

export class RoundedContainer extends HTMLElementComponent<"div"> {
	public static identifier: string = "RoundedContainer";

	constructor(options?: HTMLElementComponentOptions) {
		super("div", {
			identifier: options?.identifier || RoundedContainer.identifier,
			classes: options?.classes ? options.classes.concat([RoundedContainer.identifier]) : [RoundedContainer.identifier],
			parent: options?.parent,
		});
	}
}
