import { HTMLElementComponent } from "common/ui/components/HTMLElementComponent";
import { Component } from "common/ui/Component";
import { DirectoryContentFile } from "common/ui/components/directoryContentsCollection/DirectoryContentFile";
import { DirectoryContentFolder } from "common/ui/components/directoryContentsCollection/DirectoryContentFolder";
import { GridColumnOrderBar } from "common/ui/components/directoryContentsCollection/gridColumnOrderBar/GridColumnOrderBar";
import { toKebabCase } from "common/string";
import { DirectoryContentElement } from "common/ui/components/directoryContentsCollection/DirectoryContentElement";
import { DropTarget } from "common/ui/DropTarget";
import { Event } from "common/ui/Event";
import { BackendToFrontendEvent, FrontendToBackendEvent } from "src/APIEvents";
import { APIBridge } from "src/APIBridge";
import { EventEmitter } from "common/EventEmitter";
import { DirectoryContentElement as DirectoryContentDataElement } from "src/DirectoryContentElement";

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

		this._eventEmitter.on(Event.DirectoryContentColumnOrderUpdated, data => this._updateColumnOrder(data.data));
		this._eventEmitter.on(Event.DirectoryContentElementSelected, data => this._selectElement(data.data));
		this._eventEmitter.on(Event.DirectoryContentElementSelectedById, data => this._selectElementById(data.data));
		this._eventEmitter.on(Event.DirectoryContentFolderElementOpened, data => this._openFolderElement(data.data));

		this._apiBridge.on(BackendToFrontendEvent.ConnectedToServer, () =>
			this._apiBridge.fire(FrontendToBackendEvent.GetDirectoryContents, "/", (data: DirectoryContentDataElement[]) =>
				this._displayFolderElements(data)
			)
		);

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
		this._componentsContainer.clearChildren();
		this.build();
	}

	private _displayFolderElements(elements: DirectoryContentDataElement[]): void {
		for (let i = 0; i < elements.length; i++) {
			this._componentsContainer.appendChild(
				new DirectoryContentFolder(
					this._apiBridge,
					this._eventEmitter,
					this._componentsContainer,
					elements[i].name,
					new Date(elements[i].lastEdited),
					i
				)
			);
			i++;
		}
		this.build();
	}

	private _openFolderElement(component: DirectoryContentFolder): void {
		this._empty();
		this._apiBridge.fire(FrontendToBackendEvent.GetDirectoryContents, "/test/", (data: DirectoryContentDataElement[]) =>
			this._displayFolderElements(data)
		);
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
