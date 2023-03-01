import { HTMLElementComponent } from "src/client/common/ui/components/HTMLElementComponent.js";

export class DOMComponent extends HTMLElementComponent {
	/**
	 * The identifier that maps to this class
	 */
	public static identifier: string = "ui.components.DOMComponent";

	/**
	 * Creates a new DOMComponent
	 */
	constructor(documentElement: HTMLElement) {
		super(documentElement, undefined, DOMComponent.identifier);
	}
}
