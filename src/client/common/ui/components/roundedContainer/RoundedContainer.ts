import { HTMLElementComponent, HTMLElementComponentOptions } from "../HTMLElementComponent.js";

export class RoundedContainer<T extends keyof HTMLElementTagNameMap> extends HTMLElementComponent<T> {
	public static readonly identifier: string = "RoundedContainer";

	constructor(htmlElement?: HTMLElementTagNameMap[T] | Extract<keyof HTMLElementTagNameMap, T>, options?: HTMLElementComponentOptions) {
		super(htmlElement, {
			identifier: options?.identifier || RoundedContainer.identifier,
			classes: options?.classes ? options.classes.concat([RoundedContainer.identifier]) : [RoundedContainer.identifier],
			parent: options?.parent,
		});
	}
}
