import { DRAG_SOURCE_ATTRIBUTE } from "common/ui/Draggable";

const DRAG_HOVER_CSS_CLASS = "drag-hover";

// block the "move/copy/etc allowed" visuals for external files
window.addEventListener("dragover", function (e: DragEvent) {
	e.preventDefault();
	if (e.dataTransfer?.dropEffect) {
		e.dataTransfer.dropEffect = "none";
	}
});

window.addEventListener("drop", function (e: DragEvent) {
	e.preventDefault();
	if (e.dataTransfer?.dropEffect) {
		e.dataTransfer.dropEffect = "none";
	}
});

export class DropTarget {
	private readonly _htmlElement: HTMLElement;
	private _dropHandler: (...args: any[]) => any;

	constructor(htmlElement: HTMLElement, dropHandler: (...args: any[]) => any) {
		this._htmlElement = htmlElement;
		this._dropHandler = dropHandler;

		this._htmlElement.setAttribute("data-drop-target", "true");

		this._htmlElement.addEventListener("dragenter", e => e.preventDefault());
		this._htmlElement.addEventListener("dragover", this._allowDrop.bind(this));

		this._htmlElement.addEventListener(
			"drop",
			function (e) {
				this._cleanup();
				this._dropHandler();

				e.stopPropagation();
			}.bind(this)
		);
		this._htmlElement.addEventListener("dragleave", e => (e.target as HTMLElement).classList.remove(DRAG_HOVER_CSS_CLASS));
	}

	private _allowDrop(e: DragEvent): void {
		let target = e.target as HTMLElement;

		e.stopPropagation();
		if (target !== this._htmlElement) {
			return;
		}

		if (target.hasAttribute(DRAG_SOURCE_ATTRIBUTE)) {
			return;
		}

		target.classList.add(DRAG_HOVER_CSS_CLASS);
		e.preventDefault();
	}

	private _cleanup(): void {
		let dragSourceElement = document.querySelector(`*[${DRAG_SOURCE_ATTRIBUTE}]`);
		if (dragSourceElement) {
			dragSourceElement.removeAttribute(DRAG_SOURCE_ATTRIBUTE);
		}

		let hoveredElements = Array.from(document.querySelectorAll(`*.${DRAG_HOVER_CSS_CLASS}`));
		hoveredElements.forEach(element => element.classList.remove(DRAG_HOVER_CSS_CLASS));
	}
}
