import { Component } from "../../../Component.js";
import { HTMLElementComponent } from "../../HTMLElementComponent.js";
import { EventEmitter } from "src/client/common/EventEmitter.js";

/**
 * Doesnt extend the Draggable because drag functionality will be implemented via mouse events
 */
export class DraggableGridColumnHeader extends HTMLElementComponent<"div"> {
	public static readonly identifier: string = "DraggableGridColumnHeader";

	private readonly _eventEmitter: EventEmitter;

	private _title: string;

	private _dragOffsetX: number;
	private _index: number;

	private _mouseMoveListener: () => void;
	private _mouseUpListener: () => void;
	private _incIndexListener: () => void;
	private _decIndexListener: () => void;

	constructor(parent: Component, title: string, eventEmitter: EventEmitter) {
		super("div", {
			identifier: DraggableGridColumnHeader.identifier,
			classes: [DraggableGridColumnHeader.identifier, title.replaceAll(/\s/gim, "-")],
			parent: parent,
		});

		this.innerText(title);
		this._title = title.replaceAll(/\s/gim, "-");

		eventEmitter.on("move", this._onOtherHeaderMove.bind(this));
		this._eventEmitter = eventEmitter;

		this._htmlElement.addEventListener("mousedown", this._onMouseDown.bind(this));
		this._bindListeners();
	}

	private _incIndex(): void {
		this._index++;
	}

	private _decIndex(): void {
		this._index--;
	}

	private _bindListeners(): void {
		this._mouseMoveListener = this._onMouseMove.bind(this);
		this._mouseUpListener = this._onMouseUp.bind(this);
		this._incIndexListener = this._incIndex.bind(this);
		this._decIndexListener = this._decIndex.bind(this);
	}

	private _registerMouseListeners(): void {
		document.addEventListener("mousemove", this._mouseMoveListener);
		document.addEventListener("mouseup", this._mouseUpListener);
	}

	private _removeMouseListeners(): void {
		document.removeEventListener("mousemove", this._mouseMoveListener);
		document.removeEventListener("mouseup", this._mouseUpListener);
	}

	private _setInitialAbsolutePosition(): void {
		this._htmlElement.style.width = this._htmlElement.getBoundingClientRect().width + "px";
		this._htmlElement.style.left =
			this._htmlElement.getBoundingClientRect().x -
			this._htmlElement.parentElement!.getBoundingClientRect().x -
			+getComputedStyle(this._htmlElement).marginLeft.replace(/px/, "") +
			"px";
		this._htmlElement.style.top = this._htmlElement.getBoundingClientRect().y - this._htmlElement.parentElement!.getBoundingClientRect().y + "px";
		this.addClassName("dragging");
	}

	private _registerIndexListeners(): void {
		this._eventEmitter.on("increase", this._incIndexListener);
		this._eventEmitter.on("decrease", this._decIndexListener);
	}

	private _removeIndexListeners(): void {
		this._eventEmitter.off("increase", this._incIndexListener);
		this._eventEmitter.off("decrease", this._decIndexListener);
	}

	private _onMouseDown(e: MouseEvent): void {
		this._index = +getComputedStyle(this._htmlElement).gridColumn.slice(0, 1);

		this._registerMouseListeners();
		this._setInitialAbsolutePosition();

		this._dragOffsetX = e.clientX - this._htmlElement.getBoundingClientRect().x;

		this._registerIndexListeners();
	}

	private _onMouseMove(e: MouseEvent): void {
		let parent = this._htmlElement.parentElement!;

		if (e.clientX - this._dragOffsetX <= parent.getBoundingClientRect().x + +getComputedStyle(parent).paddingLeft.slice(0, -2)) {
			this._htmlElement.style.left = +getComputedStyle(parent).paddingLeft.slice(0, -2) + "px";
		} else if (
			e.clientX - this._dragOffsetX + this._htmlElement.getBoundingClientRect().width >
			parent.getBoundingClientRect().right - +getComputedStyle(parent).paddingRight.slice(0, -2)
		) {
			this._htmlElement.style.left =
				parent.getBoundingClientRect().width -
				this._htmlElement.getBoundingClientRect().width -
				+getComputedStyle(parent).paddingRight.slice(0, -2) +
				"px";
		} else {
			this._htmlElement.style.left =
				e.clientX -
				parent.getBoundingClientRect().x -
				this._dragOffsetX -
				+getComputedStyle(this._htmlElement).marginLeft.replace(/px/, "") +
				"px";
		}

		this._eventEmitter.fire("move", { x: e.clientX, text: this._title });
	}

	private _onMouseUp(e: MouseEvent): void {
		this._removeMouseListeners();
		this._removeIndexListeners();

		this.removeClassName("dragging");
		this.removeAttribute("style");

		this._eventEmitter.fire("dropped", { index: this._index, identifier: this._title });
	}

	private _onOtherHeaderMove(event: { data: { x: number; text: string } }) {
		if (event.data.text === this._title) {
			return;
		}

		let index = +getComputedStyle(this._htmlElement).gridColumn.slice(0, 1);
		let boundingClientRect = this._htmlElement.getBoundingClientRect();

		if (event.data.x >= boundingClientRect.x && event.data.x < boundingClientRect.x + boundingClientRect.width / 2) {
			index--;
			this._eventEmitter.fire("increase");
		} else if (event.data.x <= boundingClientRect.right && event.data.x > boundingClientRect.x + boundingClientRect.width / 2) {
			index++;
			this._eventEmitter.fire("decrease");
		} else {
			return;
		}

		this._eventEmitter.fire(`set`, { index: index, identifier: this._title });
	}
}
