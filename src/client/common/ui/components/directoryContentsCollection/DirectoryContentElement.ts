import { toDDMMYYYYWithLeadingZeros } from "../../../string.js";
import { HTMLElementComponent, HTMLElementComponentOptions } from "../HTMLElementComponent.js";
import { RoundedContainer } from "../roundedContainer/RoundedContainer.js";

type DirectoryContentElementType = "folder" | "txt";

export class DirectoryContentElement extends RoundedContainer {
	public static identifier: string = "DirectoryContentElement";

	private _name: string;
	private _lastEdited: Date;
	private _type: DirectoryContentElementType;

	private _iconAndNameWrapperComponent: HTMLElementComponent<"div">;
	private _iconComponent: HTMLElementComponent<"div">;
	private _nameComponent: HTMLElementComponent<"p">;
	private _lastEditedComponent: HTMLElementComponent<"p">;
	private _iconWrapperComponent: HTMLElementComponent<"div">;
	private _deleteIconComponent: HTMLElementComponent<"div">;
	private _downloadIconComponent: HTMLElementComponent<"div">;

	constructor(name: string, lastEdited: Date, type: DirectoryContentElementType, options?: HTMLElementComponentOptions) {
		super({
			identifier: options?.identifier || DirectoryContentElement.identifier,
			classes: options?.classes ? options.classes.concat([DirectoryContentElement.identifier]) : [DirectoryContentElement.identifier],
			parent: options?.parent,
		});

		this._name = name;
		this._lastEdited = lastEdited;
		this._type = type;

		this._createIconAndNameWrapperComponent();
		this._createIconComponent();
		this._createNameComponent();
		this._createLastEditedComponent();
		this._createIconWrapperComponent();
		this._createDeleteIconComponent();
		this._createDownloadIconComponent();
	}

	private _createDeleteIconComponent(): void {
		this._deleteIconComponent = new HTMLElementComponent("div", {
			identifier: "DeleteIcon",
			classes: ["Icon", "DeleteIcon"],
			parent: this._iconWrapperComponent,
		});
	}

	private _createDownloadIconComponent(): void {
		this._downloadIconComponent = new HTMLElementComponent("div", {
			identifier: "DownloadIcon",
			classes: ["Icon", "DownloadIcon"],
			parent: this._iconWrapperComponent,
		});
	}

	private _createIconWrapperComponent(): void {
		this._iconWrapperComponent = new HTMLElementComponent("div", {
			identifier: "IconWrapper",
			classes: ["IconWrapper"],
			parent: this,
		});
	}

	private _createIconComponent(): void {
		this._iconComponent = new HTMLElementComponent("div", {
			identifier: this._type === "folder" ? "FolderIcon" : "FileIcon",
			classes: ["Icon", this._type === "folder" ? "FolderIcon" : "FileIcon"],
			parent: this._iconAndNameWrapperComponent,
		});
	}

	private _createIconAndNameWrapperComponent(): void {
		this._iconAndNameWrapperComponent = new HTMLElementComponent("div", {
			identifier: "Wrapper",
			classes: ["Wrapper"],
			parent: this,
		});
	}

	private _createNameComponent(): void {
		this._nameComponent = new HTMLElementComponent("p", {
			identifier: "Name",
			classes: ["Name"],
			parent: this._iconAndNameWrapperComponent,
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
