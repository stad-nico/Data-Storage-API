import { HTMLElementComponent } from "src/client/common/ui/components/HTMLElementComponent.js";
import { Component } from "src/client/common/ui/Component.js";
import { DirectoryContentFile } from "./DirectoryContentFile.js";
import { DirectoryContentFolder } from "./DirectoryContentFolder.js";
import { GridColumnOrderBar } from "./gridColumnOrderBar/GridColumnOrderBar.js";

type DirectoryContentComponents = DirectoryContentFile | DirectoryContentFolder;

export class DirectoryContentsCollection extends HTMLElementComponent<"section"> {
	/**
	 * The identifier that maps to this class
	 */
	public static readonly identifier: string = "DirectoryContentsCollection";

	/**
	 * Array that holds the current directory components
	 */
	private _components: DirectoryContentComponents[];

	/**
	 * The component that handles dragging elements in a header-like bar to rearrange the order in which the name, last edited and size etc components of a DirectoryContentComponent are displayed
	 */
	private _gridColumnOrderBar: GridColumnOrderBar;

	/**
	 * The container that contains the DirectoryContentComponents
	 */
	private _componentsContainer: HTMLElementComponent<"main">;

	/**
	 * Creates a new DirectoryContentsCollection instance
	 */
	constructor(parent: Component) {
		super("section", {
			identifier: DirectoryContentsCollection.identifier,
			classes: [DirectoryContentsCollection.identifier],
			parent: parent,
		});

		this._gridColumnOrderBar = new GridColumnOrderBar(this);
		this._componentsContainer = new HTMLElementComponent("main", {
			identifier: "DirectoryContentsContainer",
			classes: ["DirectoryContentsContainer"],
			parent: this,
		});

		this._components = [
			new DirectoryContentFile(this._componentsContainer, "hi", "txt", 0, new Date(Date.now())),
			new DirectoryContentFolder(this._componentsContainer, "folder", new Date(Date.now())),
		];

		this.setAttribute("data-first-column", "name");
		this.setAttribute("data-second-column", "last-edited");
		this.setAttribute("data-third-column", "size");
		this.setAttribute("data-fourth-column", "icons");
	}
}
