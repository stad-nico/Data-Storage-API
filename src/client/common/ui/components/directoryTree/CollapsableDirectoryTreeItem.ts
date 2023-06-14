import { Component } from "../../Component";
import { HTMLElementComponent } from "../HTMLElementComponent";
import { CollapsableDirectoryTreeItemHeader } from "./CollapsableDirectoryTreeItemHeader";
import { CollapsableDirectoryTreeItemBody } from "./CollapsableDirectoryTreeItemBody";
import { EventEmitter } from "src/client/common/EventEmitter";
import { APIBridge } from "src/APIBridge";
import { Event } from "common/ui/Event";
import { DirectoryContentFolder } from "src/DirectoryContentFolder";
import { FrontendToBackendEvent } from "src/APIEvents";
import { DirectoryContentType } from "src/DirectoryContentType";
import { DirectoryContentFolderRecursive } from "src/DirectoryContentFolderRecursive";

export class CollapsableDirectoryTreeItem extends HTMLElementComponent<"div"> {
	public static readonly identifier: string = "CollapsableDirectoryTreeItem";

	private _contents: CollapsableDirectoryTreeItem[];

	private _headerComponent: CollapsableDirectoryTreeItemHeader;
	private _bodyComponent: CollapsableDirectoryTreeItemBody;

	private _name: string;
	private _relPath: string;
	private _collapsed: boolean;

	private _selected: boolean;

	constructor(
		apiBridge: APIBridge,
		eventEmitter: EventEmitter,
		name: string,
		relPath: string,
		parent: Component,
		contents: CollapsableDirectoryTreeItem[] = [],
		collapsed: boolean = true
	) {
		super(apiBridge, eventEmitter, "div", {
			identifier: CollapsableDirectoryTreeItem.identifier,
			classes: [CollapsableDirectoryTreeItem.identifier],
			parent: parent,
		});

		this._selected = false;

		this._name = name;
		this._relPath = relPath;
		this._collapsed = collapsed;
		this._contents = contents;

		this._headerComponent = new CollapsableDirectoryTreeItemHeader(apiBridge, eventEmitter, this._name, this);
		this._headerComponent.setOnCollapsableArrowIconClickHandler(e => this._onCollapsableArrowIconClick(e));
		this._bodyComponent = new CollapsableDirectoryTreeItemBody(apiBridge, eventEmitter, this);

		this._headerComponent.addEventListener(
			"click",
			function () {
				this._eventEmitter.fire(Event.TreeFolderItemOpened, this);
			}.bind(this)
		);

		if (this._contents.length === 0) {
			this._headerComponent.hideArrow();
		}

		if (this._collapsed) {
			this.collapse();
		} else {
			this.unfold();
		}
	}

	public clearContent(): void {
		this._contents = [];
		this.updateArrowStatus();
		this._bodyComponent.clearChildren();
	}

	public addContent(component: CollapsableDirectoryTreeItem): void {
		this._contents.push(component);
		this.updateArrowStatus();
		this._bodyComponent.appendChild(component);
	}

	public select(): void {
		this._selected = true;
		this.getHTMLElement().classList.add("selected");

		this.unfold();
		this._eventEmitter.fire(Event.DirectoryContentFolderElementOpened, this._relPath);
	}

	public unselect(): void {
		this._selected = false;
		this.getHTMLElement().classList.remove("selected");
	}

	public updateArrowStatus(): void {
		if (this._contents.length === 0) {
			this._headerComponent.hideArrow();
		} else {
			this._headerComponent.showArrow();
		}
	}

	public getBodyComponent(): CollapsableDirectoryTreeItemBody {
		return this._bodyComponent;
	}

	private _onCollapsableArrowIconClick(e: MouseEvent): void {
		console.log(e);
		if (this._collapsed) {
			this.unfold();
		} else {
			this.collapse();
		}
		e.stopPropagation();
	}

	public collapse(): void {
		this.addClassName("collapsed");
		this._collapsed = true;
	}

	public unfold(): void {
		this.removeClassName("collapsed");
		this._collapsed = false;

		this._apiBridge
			.fire(FrontendToBackendEvent.GetDirectoryContentsRecursive, {
				path: this._relPath,
				contentType: DirectoryContentType.Folder,
			})
			.then(data => {
				this.clearContent();

				for (let element of data) {
					let item = new CollapsableDirectoryTreeItem(
						this._apiBridge,
						this._eventEmitter,
						element.name,
						element.relativePath + element.name,
						this._bodyComponent
					);
					this.addContent(item);

					for (let content of element.contents.filter(x => x.type === DirectoryContentType.Folder)) {
						item.addContent(
							new CollapsableDirectoryTreeItem(
								this._apiBridge,
								this._eventEmitter,
								content.name,
								content.relativePath + content.name,
								item.getBodyComponent()
							)
						);
					}
				}

				this.build();
			})
			.catch(error => console.log(error));
	}
}
