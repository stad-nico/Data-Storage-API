import { EventEmitter } from "common/EventEmitter";
import { toDDMMYYYYWithLeadingZeros, toHHMM } from "common/string";
import { HTMLElementComponent, HTMLElementComponentOptions } from "common/ui/components/HTMLElementComponent";
import { DeleteIcon } from "common/ui/components/icons/DeleteIcon";
import { DownloadIcon } from "common/ui/components/icons/DownloadIcon";
import { RoundedContainer } from "common/ui/components/roundedContainer/RoundedContainer";
import { DeleteIcon24 } from "common/ui/components/icons/24/DeleteIcon24";
import { DownloadIcon24 } from "common/ui/components/icons/24/DownloadIcon24";
import { Draggable } from "common/ui/Draggable";
import { Event } from "common/ui/Event";
import { APIBridge } from "src/APIBridge";

export enum DirectoryContentElementType {
	Any,
	Folder,
	File,
}

export interface DirectoryContentElementOptions extends HTMLElementComponentOptions {
	name: string;
	lastEdited: Date;
	shouldShowLastEditedTimestamp?: boolean;
	type: DirectoryContentElementType;
	id: number;
}

export abstract class DirectoryContentElement extends RoundedContainer<"div"> {
	public static readonly identifier: string = "DirectoryContentElement";

	private _name: string;
	private _lastEdited: Date;
	private _type: DirectoryContentElementType;
	protected _id: number;

	protected _iconAndNameWrapperComponent: HTMLElementComponent<"header">;
	private _iconComponent: HTMLElementComponent<"div">;
	private _nameComponent: HTMLElementComponent<"p">;
	private _lastEditedComponent: HTMLElementComponent<"p">;
	private _iconWrapperComponent: HTMLElementComponent<"footer">;
	private _deleteIconComponent: DeleteIcon;
	private _downloadIconComponent: DownloadIcon;

	protected _selected: boolean;

	constructor(apiBridge: APIBridge, eventEmitter: EventEmitter, options: DirectoryContentElementOptions) {
		super(apiBridge, eventEmitter, "div", {
			identifier: options?.identifier || DirectoryContentElement.identifier,
			classes: options?.classes ? options.classes.concat([DirectoryContentElement.identifier]) : [DirectoryContentElement.identifier],
			parent: options?.parent,
		});

		this._name = options.name;
		this._lastEdited = options.lastEdited;
		this._type = options.type;
		this._id = options.id;

		this._createIconAndNameWrapperComponent();
		this._createNameComponent();
		this._createLastEditedComponent(options?.shouldShowLastEditedTimestamp);
		this._createIconWrapperComponent();
		this._createDownloadIconComponent();
		this._createDeleteIconComponent();

		this._selected = false;

		this._htmlElement.addEventListener("click", e => {
			this._onSelect(e);
			this._eventEmitter.fire(Event.DirectoryContentElementSelected, this);
		});

		this._htmlElement.setAttribute("data-id", "" + this._id);

		new Draggable(this._htmlElement);
	}

	private _createDeleteIconComponent(): void {
		this._deleteIconComponent = new DeleteIcon24(this._apiBridge, this._eventEmitter, this._iconWrapperComponent);

		this._deleteIconComponent.addEventListener("click", function (e) {
			e.stopPropagation();
		});
	}

	private _createDownloadIconComponent(): void {
		this._downloadIconComponent = new DownloadIcon24(this._apiBridge, this._eventEmitter, this._iconWrapperComponent);

		this._downloadIconComponent.addEventListener("click", function (e) {
			e.stopPropagation();
		});
	}

	private _createIconWrapperComponent(): void {
		this._iconWrapperComponent = HTMLElementComponent.fromOptionsAsMultipleParameters(
			this._apiBridge,
			this._eventEmitter,
			"footer",
			"IconWrapper",
			["IconWrapper"],
			this
		);
	}

	private _createIconAndNameWrapperComponent(): void {
		this._iconAndNameWrapperComponent = HTMLElementComponent.fromOptionsAsMultipleParameters(
			this._apiBridge,
			this._eventEmitter,
			"header",
			"Wrapper",
			["Wrapper"],
			this
		);
	}

	private _createNameComponent(): void {
		this._nameComponent = HTMLElementComponent.fromOptionsAsMultipleParameters(
			this._apiBridge,
			this._eventEmitter,
			"p",
			"Name",
			["Name"],
			this._iconAndNameWrapperComponent
		);

		this._nameComponent.innerText(this._name);
	}

	private _createLastEditedComponent(shouldShowLastEditedTimestamp: boolean = false): void {
		this._lastEditedComponent = HTMLElementComponent.fromOptionsAsMultipleParameters(
			this._apiBridge,
			this._eventEmitter,
			"p",
			"LastEdited",
			["LastEdited"],
			this
		);
		this._lastEditedComponent.innerText(toDDMMYYYYWithLeadingZeros(this._lastEdited, "."));

		if (shouldShowLastEditedTimestamp) {
			this._lastEditedComponent.addInnerText(" " + toHHMM(this._lastEdited, ":"));
		}
	}

	protected abstract _onSelect(e: MouseEvent): void;

	public getNameComponent(): HTMLElementComponent<"p"> {
		return this._nameComponent;
	}

	public getLastEditedComponent(): HTMLElementComponent<"p"> {
		return this._lastEditedComponent;
	}

	public select(): void {
		this._selected = true;
		this._htmlElement.classList.add("selected");
	}

	public unselect(): void {
		this._selected = false;
		this._htmlElement.classList.remove("selected");
	}
}
