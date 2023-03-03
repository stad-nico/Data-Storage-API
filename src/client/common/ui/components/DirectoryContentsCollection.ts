import { HTMLElementComponent } from "src/client/common/ui/components/HTMLElementComponent.js";
import { Component } from "src/client/common/ui/Component.js";
import { DirectoryContentFile } from "./DirectoryContentFile.js";
import { DirectoryContentFolder } from "./DirectoryContentFolder.js";

type DirectoryContentComponents = DirectoryContentFile | DirectoryContentFolder;

export class DirectoryContentsCollection extends HTMLElementComponent<"div"> {
	/**
	 * The identifier that maps to this class
	 */
	public static identifier: string = "DirectoryContentsCollection";

	/**
	 * Array that holds the current directory components
	 */
	private readonly _components: DirectoryContentComponents[];

	/**
	 * Creates a new DirectoryContentsCollection instance
	 */
	constructor(parent: Component) {
		super("div", {
			identifier: DirectoryContentsCollection.identifier,
			classes: [DirectoryContentsCollection.identifier],
			parent: parent,
		});

		this._components = [new DirectoryContentFile(this, "hi", "txt", 100), new DirectoryContentFolder(this)];
	}
}
