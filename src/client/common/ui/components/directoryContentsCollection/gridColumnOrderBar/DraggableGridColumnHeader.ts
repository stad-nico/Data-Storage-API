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

	private _mouseMoveListener: () => void;
	private _mouseUpListener: () => void;
	private _dragOffsetX: number;
	private _index: number;

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

		this._registerEvents();
	}

	private _incIndex() {
		this._index++;
	}

	private _decIndex() {
		this._index--;
	}

	private _registerEvents(): void {
		this._htmlElement.addEventListener("mousedown", this._onMouseDown.bind(this));
	}

	private _onMouseDown(e: MouseEvent): void {
		this._index = +getComputedStyle(this._htmlElement).gridColumn.slice(0, 1);
		console.log(this._index);

		this._mouseMoveListener = this._onMouseMove.bind(this);
		document.addEventListener("mousemove", this._mouseMoveListener);

		this._mouseUpListener = this._onMouseUp.bind(this);
		document.addEventListener("mouseup", this._mouseUpListener);

		this._htmlElement.style.width = this._htmlElement.getBoundingClientRect().width + "px";
		this._htmlElement.style.left = this._htmlElement.getBoundingClientRect().x + "px";
		this._htmlElement.style.top = this._htmlElement.getBoundingClientRect().y + "px";
		this.addClassName("dragging");

		this._dragOffsetX = e.clientX - this._htmlElement.getBoundingClientRect().x;

		this._incIndexListener = this._incIndex.bind(this);
		this._decIndexListener = this._decIndex.bind(this);
		this._eventEmitter.on("increase", this._incIndexListener);
		this._eventEmitter.on("decrease", this._decIndexListener);
	}

	private _onMouseMove(e: MouseEvent): void {
		let parent = this._htmlElement.parentElement!;

		if (e.clientX - this._dragOffsetX <= parent.getBoundingClientRect().x) {
			this._htmlElement.style.left = parent.getBoundingClientRect().x + "px";
		} else if (e.clientX - this._dragOffsetX + this._htmlElement.getBoundingClientRect().width > parent.getBoundingClientRect().right) {
			this._htmlElement.style.left = parent.getBoundingClientRect().right - this._htmlElement.getBoundingClientRect().width + "px";
		} else {
			this._htmlElement.style.left = e.clientX - this._dragOffsetX + "px";
		}

		this._eventEmitter.fire("move", { x: e.clientX, text: this._title });
	}

	private _onMouseUp(e: MouseEvent): void {
		document.removeEventListener("mousemove", this._mouseMoveListener);
		document.removeEventListener("mouseup", this._mouseUpListener);

		this.removeClassName("dragging");
		this.removeAttribute("style");

		this._eventEmitter.on("increase", this._incIndexListener);
		this._eventEmitter.on("decrease", this._decIndexListener);

		console.log(this._index);

		this._eventEmitter.fire("set", { index: this._index, identifier: this._title });
	}

	private _onOtherHeaderMove(event: { data: { x: number; text: string } }) {
		//! BUG: dragging a header once to the left, dropping it and drag once again once to the left
		if (event.data.text === this._title) {
			return;
		}

		let index = +getComputedStyle(this._htmlElement).gridColumn.slice(0, 1);

		if (
			event.data.x >= this._htmlElement.getBoundingClientRect().x &&
			event.data.x < this._htmlElement.getBoundingClientRect().x + this._htmlElement.getBoundingClientRect().width / 2
		) {
			index--;
			this._eventEmitter.fire("increase");
		} else if (
			event.data.x <= this._htmlElement.getBoundingClientRect().right &&
			event.data.x > this._htmlElement.getBoundingClientRect().x + this._htmlElement.getBoundingClientRect().width / 2
		) {
			index++;
			this._eventEmitter.fire("decrease");
		} else {
			return;
		}

		this._eventEmitter.fire(`set`, { index: index, identifier: this._title });
	}
}
