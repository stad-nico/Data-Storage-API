import { HTMLElementComponent } from "src/client/common/ui/components/HTMLElementComponent.js";
import { Component } from "src/client/common/ui/Component.js";
import { DirectoryContentFile } from "./DirectoryContentFile.js";
import { DirectoryContentFolder } from "./DirectoryContentFolder.js";
import { GridColumnOrderBar } from "./gridColumnOrderBar/GridColumnOrderBar.js";
import { EventEmitter } from "src/client/common/EventEmitter.js";
import { toKebabCase } from "src/client/common/string.js";
import { DirectoryContentElement } from "./DirectoryContentElement.js";

export class DirectoryContentsCollection extends HTMLElementComponent<"section"> {
	/**
	 * The identifier that maps to this class
	 */
	public static readonly identifier: string = "DirectoryContentsCollection";

	/**
	 * Array that holds the current directory components
	 */
	private _components: DirectoryContentElement[];

	/**
	 * The component that handles dragging elements in a header-like bar to rearrange the order in which the name, last edited and size etc components of a DirectoryContentComponent are displayed
	 */
	private _gridColumnOrderBar: GridColumnOrderBar;

	/**
	 * The container that contains the DirectoryContentComponents
	 */
	private _componentsContainer: HTMLElementComponent<"main">;

	/**
	 * EventEmitter responsible for communicating with its components
	 */
	private _eventEmitter: EventEmitter;

	/**
	 * Reference to the current selected element
	 */
	private _selectedComponent: DirectoryContentElement;

	/**
	 * Creates a new DirectoryContentsCollection instance
	 */
	constructor(parent: Component) {
		super("section", {
			identifier: DirectoryContentsCollection.identifier,
			classes: [DirectoryContentsCollection.identifier],
			parent: parent,
		});

		this._eventEmitter = new EventEmitter();
		this._eventEmitter.on("update-column-order", data => this._updateColumnOrder(data.data));
		this._eventEmitter.on("select", data => this._selectElement(data.data));

		this._gridColumnOrderBar = new GridColumnOrderBar(this, this._eventEmitter);
		this._componentsContainer = new HTMLElementComponent("main", {
			identifier: "DirectoryContentsContainer",
			classes: ["DirectoryContentsContainer"],
			parent: this,
		});

		this._components = [
			new DirectoryContentFolder(this._eventEmitter, this._componentsContainer, "folder", new Date(Date.now())),
			new DirectoryContentFolder(this._eventEmitter, this._componentsContainer, "folder", new Date(Date.now())),
			new DirectoryContentFolder(this._eventEmitter, this._componentsContainer, "folder", new Date(Date.now())),
			new DirectoryContentFolder(this._eventEmitter, this._componentsContainer, "folder", new Date(Date.now())),
			new DirectoryContentFolder(this._eventEmitter, this._componentsContainer, "folder", new Date(Date.now())),
			new DirectoryContentFolder(this._eventEmitter, this._componentsContainer, "folder", new Date(Date.now())),
			new DirectoryContentFolder(this._eventEmitter, this._componentsContainer, "folder", new Date(Date.now())),
			new DirectoryContentFolder(this._eventEmitter, this._componentsContainer, "folder", new Date(Date.now())),
			new DirectoryContentFile(this._eventEmitter, this._componentsContainer, "hi", "txt", 0, new Date(Date.now())),
			new DirectoryContentFolder(this._eventEmitter, this._componentsContainer, "folder", new Date(Date.now())),
			new DirectoryContentFile(this._eventEmitter, this._componentsContainer, "hi", "txt", 0, new Date(Date.now())),
			new DirectoryContentFolder(this._eventEmitter, this._componentsContainer, "folder", new Date(Date.now())),
		];

		this.setAttribute("data-first-column", "name");
		this.setAttribute("data-second-column", "last-edited");
		this.setAttribute("data-third-column", "size");
		this.setAttribute("data-fourth-column", "icons");
	}

	private _updateColumnOrder(attributes: DOMStringMap): void {
		for (let key in attributes) {
			this.setAttribute("data-" + toKebabCase(key), attributes[key]!);
		}
	}

	private _selectElement(component: DirectoryContentElement): void {
		if (this._selectedComponent) {
			this._selectedComponent.unselect();
		}

		component.select();
		this._selectedComponent = component;
	}
}
