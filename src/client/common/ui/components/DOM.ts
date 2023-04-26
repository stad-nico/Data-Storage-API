import { HTMLElementComponent } from "common/ui/components/HTMLElementComponent";
import { BackendToFrontendEvent } from "src/APIEvents";
import { EventEmitter } from "common/EventEmitter";
import { APIBridge } from "src/APIBridge";

export class DOMComponent extends HTMLElementComponent<"main"> {
	/**
	 * The identifier that maps to this class
	 */
	public static readonly identifier: string = "DOMComponent";

	/**
	 * The document body element all components will be injected into
	 */
	private readonly _documentBodyElement: HTMLElement;

	/**
	 * Creates a new DOMComponent
	 */
	constructor(api: APIBridge, eventEmitter: EventEmitter, classes?: string[]) {
		super(api, eventEmitter, "main", {
			identifier: DOMComponent.identifier,
			classes: classes ? classes.concat([DOMComponent.identifier]) : [DOMComponent.identifier],
			parent: undefined,
		});

		this._documentBodyElement = document.body;
	}

	public override build(): HTMLElement {
		let buildElement = super.build();
		this._documentBodyElement.append(buildElement);
		return buildElement;
	}
}
