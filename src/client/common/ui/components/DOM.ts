import { HTMLElementComponent } from "src/client/common/ui/components/HTMLElementComponent.js";

export class DOMComponent extends HTMLElementComponent<"div"> {
	/**
	 * The identifier that maps to this class
	 */
	public static identifier: string = "DOMComponent";

	/**
	 * The document body element all components will be injected into
	 */
	private readonly _documentBodyElement: HTMLElement;

	/**
	 * Creates a new DOMComponent
	 */
	constructor(documentBodyElement: HTMLElement) {
		super("div", {
			identifier: DOMComponent.identifier,
			classes: [DOMComponent.identifier],
			parent: undefined,
		});

		this._documentBodyElement = documentBodyElement;
	}

	public override build(): HTMLDivElement {
		let buildElement = super.build();
		this._documentBodyElement.append(buildElement);
		return buildElement;
	}
}
