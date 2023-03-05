import { toDDMMYYYYWithLeadingZeros } from "../../../string.js";
import { HTMLElementComponent, HTMLElementComponentOptions } from "../HTMLElementComponent.js";
import { RoundedContainer } from "../roundedContainer/RoundedContainer.js";

export class DirectoryContentElement extends RoundedContainer {
	public static identifier: string = "DirectoryContentElement";

	private _name: string;
	private _lastEdited: Date;

	private _nameComponent: HTMLElementComponent<"p">;
	private _lastEditedComponent: HTMLElementComponent<"p">;

	constructor(name: string, lastEdited: Date, options?: HTMLElementComponentOptions) {
		super({
			identifier: options?.identifier || DirectoryContentElement.identifier,
			classes: options?.classes ? options.classes.concat([DirectoryContentElement.identifier]) : [DirectoryContentElement.identifier],
			parent: options?.parent,
		});

		this._name = name;
		this._lastEdited = lastEdited;

		this._createNameComponent();
		this._createLastEditedComponent();
	}

	private _createNameComponent(): void {
		this._nameComponent = new HTMLElementComponent("p", {
			identifier: "Name",
			classes: ["Name"],
			parent: this,
		});

		this._nameComponent.innerText(this._name);
	}

	private _createLastEditedComponent(): void {
		this._lastEditedComponent = new HTMLElementComponent("p", {
			identifier: "LastEdited",
			classes: ["LastEdited"],
			parent: this,
		});

		this._lastEditedComponent.innerText(toDDMMYYYYWithLeadingZeros(this._lastEdited, "."));
	}

	public getNameComponent(): HTMLElementComponent<"p"> {
		return this._nameComponent;
	}

	public getLastEditedComponent(): HTMLElementComponent<"p"> {
		return this._lastEditedComponent;
	}
}
