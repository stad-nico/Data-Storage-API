import { EventEmitter } from "common/EventEmitter";
import { HTMLElementComponent, HTMLElementComponentOptions } from "common/ui/components/HTMLElementComponent";
import { APIBridge } from "src/APIBridge";

export class RoundedContainer<T extends keyof HTMLElementTagNameMap> extends HTMLElementComponent<T> {
	public static readonly identifier: string = "RoundedContainer";

	constructor(
		apiBridge: APIBridge,
		eventEmitter: EventEmitter,
		htmlElement?: HTMLElementTagNameMap[T] | Extract<keyof HTMLElementTagNameMap, T>,
		options?: HTMLElementComponentOptions
	) {
		super(apiBridge, eventEmitter, htmlElement, {
			identifier: options?.identifier || RoundedContainer.identifier,
			classes: options?.classes ? options.classes.concat([RoundedContainer.identifier]) : [RoundedContainer.identifier],
			parent: options?.parent,
		});
	}
}
