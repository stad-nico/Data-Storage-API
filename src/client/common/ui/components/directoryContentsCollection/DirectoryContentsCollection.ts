import { HTMLElementComponent } from "common/ui/components/HTMLElementComponent";
import { Component } from "common/ui/Component";
import { DirectoryContentFolder } from "common/ui/components/directoryContentsCollection/DirectoryContentFolder";
import { DirectoryContentFile } from "common/ui/components/directoryContentsCollection/DirectoryContentFile";
import { GridColumnOrderBar } from "common/ui/components/directoryContentsCollection/gridColumnOrderBar/GridColumnOrderBar";
import { toKebabCase } from "common/string";
import { DirectoryContentElement } from "common/ui/components/directoryContentsCollection/DirectoryContentElement";
import { DropTarget } from "common/ui/DropTarget";
import { Event } from "common/ui/Event";
import { BackendToFrontendEvent, FrontendToBackendEvent } from "src/APIEvents";
import { APIBridge } from "src/APIBridge";
import { EventEmitter } from "common/EventEmitter";
import { DirectoryContentFolder as DirectoryContentFolderData } from "src/DirectoryContentFolder";
import { DirectoryContentFile as DirectoryContentFileData } from "src/DirectoryContentFile";
import { DirectoryContentType } from "src/DirectoryContentType";

export class DirectoryContentsCollection extends HTMLElementComponent<"section"> {
	/**
	 * The identifier that maps to this class
	 */
	public static readonly identifier: string = "DirectoryContentsCollection";

	/**
	 * A counter to keep track of the index new folder/file elements get assigned at creation
	 * This counter will be reset after calling this.empty()
	 */
	private _elementCounter: number;

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
	 * Reference to the current selected element
	 */
	private _selectedComponent: DirectoryContentElement;

	/**
	 * Creates a new DirectoryContentsCollection instance
	 */
	constructor(apiBridge: APIBridge, eventEmitter: EventEmitter, parent: Component) {
		super(apiBridge, eventEmitter, "section", {
			identifier: DirectoryContentsCollection.identifier,
			classes: [DirectoryContentsCollection.identifier],
			parent: parent,
		});

		this._elementCounter = 0;

		this._eventEmitter.on(Event.DirectoryContentColumnOrderUpdated, data => this._updateColumnOrder(data.data));
		this._eventEmitter.on(Event.DirectoryContentElementSelected, data => this._selectElement(data.data));
		this._eventEmitter.on(Event.DirectoryContentElementSelectedById, data => this._selectElementById(data.data));
		this._eventEmitter.on(Event.DirectoryContentFolderElementOpened, data => this._openFolder(data.data));

		this.addEventListener("click", () => {
			if (this._selectedComponent) {
				this._selectedComponent.unselect();
				this._selectedComponent = undefined;
			}
		});

		this._apiBridge.on(BackendToFrontendEvent.ConnectedToServer, () => {
			this._apiBridge
				.fire(FrontendToBackendEvent.GetDirectoryContents, { path: "/", contentType: DirectoryContentType.FolderOrFile })
				.then(data => this._displayElements(data))
				.catch(error => console.error(error));
		});

		this._gridColumnOrderBar = new GridColumnOrderBar(apiBridge, eventEmitter, this);
		this._componentsContainer = new HTMLElementComponent(apiBridge, eventEmitter, "main", {
			identifier: "DirectoryContentsContainer",
			classes: ["DirectoryContentsContainer"],
			parent: this,
		});

		this._components = [];

		this.setAttribute("data-first-column", "name");
		this.setAttribute("data-second-column", "last-edited");
		this.setAttribute("data-third-column", "size");
		this.setAttribute("data-fourth-column", "icons");

		new DropTarget(this._htmlElement, (e: DragEvent) => {
			console.log("external drop");
		});
	}

	private _empty(): void {
		this._elementCounter = 0;

		this._components = [];
		this._componentsContainer.clearChildren();
		this.build();
	}

	private _addDirectoryContentFile(data: DirectoryContentFileData, updateUI: boolean = true) {
		let file: DirectoryContentFile = new DirectoryContentFile(
			this._apiBridge,
			this._eventEmitter,
			this._componentsContainer,
			data.name,
			data.extension,
			data.size,
			new Date(data.lastEdited),
			this._elementCounter++,
			data.relativePath
		);

		this._componentsContainer.appendChild(file);
		this._components.push(file);

		if (updateUI) {
			this.build();
		}
	}

	private _addDirectoryContentFolder(data: DirectoryContentFolderData, updateUI: boolean = true) {
		let file: DirectoryContentFolder = new DirectoryContentFolder(
			this._apiBridge,
			this._eventEmitter,
			this._componentsContainer,
			data.name,
			new Date(data.lastEdited),
			this._elementCounter++,
			data.relativePath
		);

		this._componentsContainer.appendChild(file);
		this._components.push(file);

		if (updateUI) {
			this.build();
		}
	}

	private _displayElements(elements: (DirectoryContentFileData | DirectoryContentFolderData)[]): void {
		this._empty();

		elements = elements.sort((a, b) => a.type - b.type);

		for (let element of elements) {
			if (element.type === DirectoryContentType.File) {
				this._addDirectoryContentFile(element as DirectoryContentFileData, false);
			}
			if (element.type === DirectoryContentType.Folder) {
				this._addDirectoryContentFolder(element as DirectoryContentFolderData, false);
			}
		}

		this.build();
	}

	private _openFolder(component: DirectoryContentFolder): void {
		let relativePath = [component.relativePath === "/" ? "" : component.relativePath, component.name].join("/");

		this._apiBridge
			.fire(FrontendToBackendEvent.GetDirectoryContents, { path: relativePath, contentType: DirectoryContentType.FolderOrFile })
			.then(data => this._displayElements(data))
			.catch(error => console.log(error));
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
