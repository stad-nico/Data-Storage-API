import { DRAG_SOURCE_ATTRIBUTE } from "./Draggable.js";

export class DropTarget {
	private readonly _htmlElement: HTMLElement;
	private _dropHandler: (...args: any[]) => any;

	constructor(htmlElement: HTMLElement, dropHandler: (...args: any[]) => any) {
		this._htmlElement = htmlElement;
		this._dropHandler = dropHandler;

		this._htmlElement.setAttribute("data-drop-target", "true");

		this._htmlElement.addEventListener("dragenter", e => e.preventDefault());
		this._htmlElement.addEventListener("dragover", this._allowDrop);
		this._htmlElement.addEventListener(
			"drop",
			function () {
				this._cleanup();
				this._dropHandler();
			}.bind(this)
		);
		this._htmlElement.addEventListener("dragleave", e => (e.target as HTMLElement).classList.remove("drag-hover"));
	}

	private _allowDrop(e: DragEvent): void {
		let target = e.target as HTMLElement;

		if (target.hasAttribute(DRAG_SOURCE_ATTRIBUTE)) {
			return;
		}

		target.classList.add("drag-hover");
		e.preventDefault();
	}

	private _cleanup(): void {
		let dragSourceElement = document.querySelector(`*[${DRAG_SOURCE_ATTRIBUTE}]`);
		if (dragSourceElement) {
			dragSourceElement.removeAttribute(DRAG_SOURCE_ATTRIBUTE);
		}
	}
}
