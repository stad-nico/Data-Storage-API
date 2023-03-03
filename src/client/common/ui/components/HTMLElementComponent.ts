import { Component } from "src/client/common/ui/Component.js";
import { toKebabCase } from "src/client/common/string.js";

export type HTMLElementComponentOptions = {
	parent?: Component;
	identifier?: string;
	classes?: string[];
};

export class HTMLElementComponent<T extends keyof HTMLElementTagNameMap> extends Component {
	/**
	 * The identifier that maps to this class
	 */
	public static identifier: string = "HTMLElementComponent";

	/**
	 * The HTMLElement contained by this component
	 */
	protected readonly _htmlElement: HTMLElementTagNameMap[T];

	/**
	 * Class name strings
	 */
	protected _classes: string[];

	/**
	 * Creates a new HTMLElementComponent
	 *
	 * @param parent The parent component
	 */
	constructor(htmlElement?: HTMLElementTagNameMap[T] | Extract<keyof HTMLElementTagNameMap, T>, options?: HTMLElementComponentOptions) {
		super(options?.identifier || HTMLElementComponent.identifier, options?.parent);

		this._htmlElement =
			htmlElement instanceof HTMLElement ? htmlElement : document.createElement(htmlElement as Extract<keyof HTMLElementTagNameMap, T>);

		this._classes = options?.classes ? options.classes : [];
	}

	/**
	 * Adds the class names defined in this._classes to the HTMLElement
	 */
	private _applyClassNames(): void {
		if (this._classes.length === 0) {
			return;
		}

		this._classes.forEach(className => this._htmlElement.classList.add(this._formatClassName(className)));
	}

	/**
	 * Formats a class name for proper html
	 *
	 * @param className The class name string to be formatted
	 */
	private _formatClassName(className: string): string {
		return toKebabCase(className);
	}

	/**
	 * Add a new class name to class name array
	 *
	 * @param className The new class name to add
	 */
	protected _addClassName(className: string): void {
		this._classes.push(className);
	}

	/**
	 * Builds the component and its children if recursive is true and returns its HTMLElement
	 *
	 * @param recursive If child components should be build too
	 */
	public build(recursive: boolean = true): HTMLElementTagNameMap[T] {
		this._applyClassNames();

		if (recursive) {
			for (let child of this._children) {
				this._htmlElement.append(child.build());
			}
		}

		return this._htmlElement;
	}

	/**
	 * Set html attribute
	 *
	 * @param attributeName The name of the attribute
	 * @param attributeValue The value of the attribute
	 */
	public setAttribute(attributeName: string, attributeValue: string): void {
		this._htmlElement.setAttribute(attributeName, attributeValue);
	}

	/**
	 * remove html attribute
	 *
	 * @param attributeName The name of the attribute that should be removed
	 */
	public removeAttribute(attributeName: string): void {
		this._htmlElement.removeAttribute(attributeName);
	}

	/**
	 * inner text
	 *
	 * @param text The text
	 */
	public innerText(text: string): void {
		this._htmlElement.innerText = text;
	}
}
