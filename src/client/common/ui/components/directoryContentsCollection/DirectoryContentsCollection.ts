import { HTMLElementComponent } from "common/ui/components/HTMLElementComponent";
import { Component } from "common/ui/Component";
import { DirectoryContentFile } from "common/ui/components/directoryContentsCollection/DirectoryContentFile";
import { DirectoryContentFolder } from "common/ui/components/directoryContentsCollection/DirectoryContentFolder";
import { GridColumnOrderBar } from "common/ui/components/directoryContentsCollection/gridColumnOrderBar/GridColumnOrderBar";
import { EventEmitter } from "common/EventEmitter";
import { toKebabCase } from "common/string";
import { DirectoryContentElement } from "common/ui/components/directoryContentsCollection/DirectoryContentElement";
import { DropTarget } from "common/ui/DropTarget";
import { Event } from "common/ui/Event";

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
	constructor(parent: Component, eventEmitter: EventEmitter) {
		super("section", {
			identifier: DirectoryContentsCollection.identifier,
			classes: [DirectoryContentsCollection.identifier],
			parent: parent,
		});

		this._eventEmitter = eventEmitter;
		this._eventEmitter.on(Event.DirectoryContentColumnOrderUpdated, data => this._updateColumnOrder(data.data));
		this._eventEmitter.on(Event.DirectoryContentElementSelected, data => this._selectElement(data.data));
		this._eventEmitter.on(Event.DirectoryContentElementSelectedById, data => this._selectElementById(data.data));

		this._gridColumnOrderBar = new GridColumnOrderBar(this, this._eventEmitter);
		this._componentsContainer = new HTMLElementComponent("main", {
			identifier: "DirectoryContentsContainer",
			classes: ["DirectoryContentsContainer"],
			parent: this,
		});

		this._components = [
			new DirectoryContentFolder(this._eventEmitter, this._componentsContainer, "folder", new Date(Date.now()), 0),
			new DirectoryContentFolder(this._eventEmitter, this._componentsContainer, "folder", new Date(Date.now()), 1),
			new DirectoryContentFolder(this._eventEmitter, this._componentsContainer, "folder", new Date(Date.now()), 2),
			new DirectoryContentFolder(this._eventEmitter, this._componentsContainer, "folder", new Date(Date.now()), 3),
			new DirectoryContentFolder(this._eventEmitter, this._componentsContainer, "folder", new Date(Date.now()), 4),
			new DirectoryContentFolder(this._eventEmitter, this._componentsContainer, "folder", new Date(Date.now()), 5),
			new DirectoryContentFolder(this._eventEmitter, this._componentsContainer, "folder", new Date(Date.now()), 6),
			new DirectoryContentFolder(this._eventEmitter, this._componentsContainer, "folder", new Date(Date.now()), 7),
			new DirectoryContentFile(this._eventEmitter, this._componentsContainer, "hi", "txt", 0, new Date(Date.now()), 8),
			new DirectoryContentFolder(this._eventEmitter, this._componentsContainer, "folder", new Date(Date.now()), 9),
			new DirectoryContentFile(this._eventEmitter, this._componentsContainer, "hi", "txt", 0, new Date(Date.now()), 10),
			new DirectoryContentFolder(this._eventEmitter, this._componentsContainer, "folder", new Date(Date.now()), 11),
		];

		this.setAttribute("data-first-column", "name");
		this.setAttribute("data-second-column", "last-edited");
		this.setAttribute("data-third-column", "size");
		this.setAttribute("data-fourth-column", "icons");

		new DropTarget(this._htmlElement, (e: DragEvent) => {
			console.log("external drop");
		});
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

	private _selectElementById(id: number): void {
		if (this._selectedComponent) {
			this._selectedComponent.unselect();
		}

		let componentToSelect = this._components[id];
		componentToSelect.select();
		this._selectedComponent = componentToSelect;
	}
}
