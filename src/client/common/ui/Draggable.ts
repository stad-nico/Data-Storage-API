export const DRAG_SOURCE_ATTRIBUTE = "data-drag-source";

export class Draggable {
	private readonly _htmlElement: HTMLElement;

	constructor(htmlElement: HTMLElement) {
		this._htmlElement = htmlElement;

		this._htmlElement.setAttribute("draggable", "true");

		this._htmlElement.addEventListener("dragstart", this._onDragStart);
		this._htmlElement.addEventListener("dragend", this._cleanup.bind(this));
	}

	private _onDragStart(e: DragEvent): void {
		(e.target as HTMLElement).setAttribute(DRAG_SOURCE_ATTRIBUTE, "true");
	}

	private _cleanup(): void {
		this._htmlElement.removeAttribute(DRAG_SOURCE_ATTRIBUTE);
	}
}
