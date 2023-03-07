import { HTMLElementComponent } from "src/client/common/ui/components/HTMLElementComponent.js";

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
	constructor(documentBodyElement: HTMLElement, classes?: string[]) {
		super("main", {
			identifier: DOMComponent.identifier,
			classes: classes ? classes.concat([DOMComponent.identifier]) : [DOMComponent.identifier],
			parent: undefined,
		});

		this._documentBodyElement = documentBodyElement;
	}

	public override build(): HTMLElement {
		let buildElement = super.build();
		this._documentBodyElement.append(buildElement);
		return buildElement;
	}
}
