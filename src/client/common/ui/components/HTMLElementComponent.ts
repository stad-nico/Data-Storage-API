import { Component } from "src/client/common/ui/Component.js";

export class HTMLElementComponent extends Component {
	/**
	 * The identifier that maps to this class
	 */
	public static identifier: string = "ui.components.HTMLElementComponent";

	/**
	 * The HTMLElement contained by this component
	 */
	private readonly _htmlElement: HTMLElement;

	/**
	 * Creates a new HTMLElementComponent
	 *
	 * @param parent The parent component
	 */
	constructor(htmlElementOrTagName: HTMLElement | keyof HTMLElementTagNameMap, parent?: Component, identifier?: string) {
		super(identifier || HTMLElementComponent.identifier, parent);

		if (htmlElementOrTagName instanceof HTMLElement) {
			this._htmlElement = htmlElementOrTagName;
		} else {
			this._htmlElement = document.createElement(htmlElementOrTagName);
		}
	}
}
