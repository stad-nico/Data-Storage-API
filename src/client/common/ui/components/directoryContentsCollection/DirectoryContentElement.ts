import { EventEmitter } from "src/client/common/EventEmitter.js";
import { toDDMMYYYYWithLeadingZeros, toHHMM } from "../../../string.js";
import { HTMLElementComponent, HTMLElementComponentOptions } from "../HTMLElementComponent.js";
import { RoundedContainer } from "../roundedContainer/RoundedContainer.js";
import { SVGIcon } from "../SVGIcon.js";

type DirectoryContentElementType = "folder" | "txt";

export interface DirectoryContentElementOptions extends HTMLElementComponentOptions {
	name: string;
	lastEdited: Date;
	shouldShowLastEditedTimestamp?: boolean;
	type: DirectoryContentElementType;
}

export abstract class DirectoryContentElement extends RoundedContainer<"div"> {
	public static readonly identifier: string = "DirectoryContentElement";

	private _name: string;
	private _lastEdited: Date;
	private _type: DirectoryContentElementType;

	protected _iconAndNameWrapperComponent: HTMLElementComponent<"header">;
	private _iconComponent: HTMLElementComponent<"div">;
	private _nameComponent: HTMLElementComponent<"p">;
	private _lastEditedComponent: HTMLElementComponent<"p">;
	private _iconWrapperComponent: HTMLElementComponent<"footer">;
	private _deleteIconComponent: HTMLElementComponent<"a">;
	private _downloadIconComponent: SVGIcon;

	private _selected: boolean;

	private _eventEmitter: EventEmitter;

	constructor(eventEmitter: EventEmitter, options: DirectoryContentElementOptions) {
		super("div", {
			identifier: options?.identifier || DirectoryContentElement.identifier,
			classes: options?.classes ? options.classes.concat([DirectoryContentElement.identifier]) : [DirectoryContentElement.identifier],
			parent: options?.parent,
		});

		this._name = options.name;
		this._lastEdited = options.lastEdited;
		this._type = options.type;

		this._createIconAndNameWrapperComponent();
		this._createNameComponent();
		this._createLastEditedComponent(options?.shouldShowLastEditedTimestamp);
		this._createIconWrapperComponent();
		this._createDownloadIconComponent();
		this._createDeleteIconComponent();

		this._eventEmitter = eventEmitter;
		this._selected = false;

		this._htmlElement.addEventListener("click", e => this._eventEmitter.fire("select", this));
	}

	private _createDeleteIconComponent(): void {
		this._deleteIconComponent = new SVGIcon({
			identifier: "DeleteIcon",
			classes: ["DeleteIcon"],
			parent: this._iconWrapperComponent,
			dpath: "M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21ZM17 6H7v13h10ZM9 17h2V8H9Zm4 0h2V8h-2ZM7 6v13Z",
		});

		this._deleteIconComponent.addEventListener("click", function (e) {
			e.stopPropagation();
		});
	}

	private _createDownloadIconComponent(): void {
		this._downloadIconComponent = new SVGIcon({
			identifier: "DownloadIcon",
			classes: ["DownloadIcon"],
			parent: this._iconWrapperComponent,
			dpath: "M6 20q-.825 0-1.412-.587Q4 18.825 4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413Q18.825 20 18 20Zm6-4-5-5 1.4-1.45 2.6 2.6V4h2v8.15l2.6-2.6L17 11Z",
		});

		this._downloadIconComponent.addEventListener("click", function (e) {
			e.stopPropagation();
		});
	}

	private _createIconWrapperComponent(): void {
		this._iconWrapperComponent = HTMLElementComponent.fromOptionsAsMultipleParameters("footer", "IconWrapper", ["IconWrapper"], this);
	}

	private _createIconAndNameWrapperComponent(): void {
		this._iconAndNameWrapperComponent = HTMLElementComponent.fromOptionsAsMultipleParameters("header", "Wrapper", ["Wrapper"], this);
	}

	private _createNameComponent(): void {
		this._nameComponent = HTMLElementComponent.fromOptionsAsMultipleParameters("p", "Name", ["Name"], this._iconAndNameWrapperComponent);

		this._nameComponent.innerText(this._name);
	}

	private _createLastEditedComponent(shouldShowLastEditedTimestamp: boolean = true): void {
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

	public select(): void {
		this._selected = true;
		this._htmlElement.classList.add("selected");
	}

	public unselect(): void {
		this._selected = false;
		this._htmlElement.classList.remove("selected");
	}
}
