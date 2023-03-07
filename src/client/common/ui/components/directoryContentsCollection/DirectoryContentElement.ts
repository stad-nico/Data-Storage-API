import { toDDMMYYYYWithLeadingZeros, toHHMM } from "../../../string.js";
import { HTMLElementComponent, HTMLElementComponentOptions } from "../HTMLElementComponent.js";
import { RoundedContainer } from "../roundedContainer/RoundedContainer.js";

type DirectoryContentElementType = "folder" | "txt";

export interface DirectoryContentElementOptions extends HTMLElementComponentOptions {
	name: string;
	lastEdited: Date;
	shouldShowLastEditedTimestamp?: boolean;
	type: DirectoryContentElementType;
}

export class DirectoryContentElement extends RoundedContainer {
	public static readonly identifier: string = "DirectoryContentElement";

	private _name: string;
	private _lastEdited: Date;
	private _type: DirectoryContentElementType;

	private _iconAndNameWrapperComponent: HTMLElementComponent<"header">;
	private _iconComponent: HTMLElementComponent<"div">;
	private _nameComponent: HTMLElementComponent<"p">;
	private _lastEditedComponent: HTMLElementComponent<"p">;
	private _iconWrapperComponent: HTMLElementComponent<"footer">;
	private _deleteIconComponent: HTMLElementComponent<"div">;
	private _downloadIconComponent: HTMLElementComponent<"div">;

	constructor(options: DirectoryContentElementOptions) {
		super({
			identifier: options?.identifier || DirectoryContentElement.identifier,
			classes: options?.classes ? options.classes.concat([DirectoryContentElement.identifier]) : [DirectoryContentElement.identifier],
			parent: options?.parent,
		});

		this._name = options.name;
		this._lastEdited = options.lastEdited;
		this._type = options.type;

		this._createIconAndNameWrapperComponent();
		this._createIconComponent();
		this._createNameComponent();
		this._createLastEditedComponent(options?.shouldShowLastEditedTimestamp);
		this._createIconWrapperComponent();
		this._createDeleteIconComponent();
		this._createDownloadIconComponent();
	}

	private _createDeleteIconComponent(): void {
		this._deleteIconComponent = HTMLElementComponent.fromOptionsAsMultipleParameters(
			"div",
			"DeleteIcon",
			["Icon", "DeleteIcon"],
			this._iconWrapperComponent
		);
	}

	private _createDownloadIconComponent(): void {
		this._downloadIconComponent = HTMLElementComponent.fromOptionsAsMultipleParameters(
			"div",
			"DownloadIcon",
			["Icon", "DownloadIcon"],
			this._iconWrapperComponent
		);
	}

	private _createIconWrapperComponent(): void {
		this._iconWrapperComponent = HTMLElementComponent.fromOptionsAsMultipleParameters("footer", "IconWrapper", ["IconWrapper"], this);
	}

	private _createIconComponent(): void {
		this._iconComponent = new HTMLElementComponent("div", {
			identifier: this._type === "folder" ? "FolderIcon" : "FileIcon",
			classes: ["Icon", this._type === "folder" ? "FolderIcon" : "FileIcon"],
			parent: this._iconAndNameWrapperComponent,
		});
	}

	private _createIconAndNameWrapperComponent(): void {
		this._iconAndNameWrapperComponent = HTMLElementComponent.fromOptionsAsMultipleParameters("header", "Wrapper", ["Wrapper"], this);
	}

	private _createNameComponent(): void {
		this._nameComponent = HTMLElementComponent.fromOptionsAsMultipleParameters("p", "Name", ["Name"], this._iconAndNameWrapperComponent);

		this._nameComponent.innerText(this._name);
	}

	private _createLastEditedComponent(shouldShowLastEditedTimestamp: boolean = false): void {
		this._lastEditedComponent = HTMLElementComponent.fromOptionsAsMultipleParameters("p", "LastEdited", ["LastEdited"], this);
		this._lastEditedComponent.innerText(toDDMMYYYYWithLeadingZeros(this._lastEdited, "."));

		if (shouldShowLastEditedTimestamp) {
			this._lastEditedComponent.addInnerText(" " + toHHMM(this._lastEdited, ":"));
		}
	}

	public getNameComponent(): HTMLElementComponent<"p"> {
		return this._nameComponent;
	}

	public getLastEditedComponent(): HTMLElementComponent<"p"> {
		return this._lastEditedComponent;
	}
}
