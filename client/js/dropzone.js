// block the "move/copy/etc allowed" visuals for external files
// window.addEventListener("dragover", () => console.log("over"));
const DRAG_SOURCE_ATTRIBUTE = "data-drag-source";
const DRAG_HOVER_CSS_CLASS = "drag-hover";

window.addEventListener("dragenter", function (e) {
	if (!e.target.hasAttribute("data-drop-zone")) {
		this.addEventListener("dragover", preventDroppingContentsFromOtherWindows);
	} else {
		this.removeEventListener("dragover", preventDroppingContentsFromOtherWindows);
	}
});

window.addEventListener("drop", function (e) {
	e.preventDefault();
	e.dataTransfer.effectAllowed = "none";
	e.dataTransfer.dropEffect = "none";
});

export function makeDraggable(element) {
	element.setAttribute("draggable", true);

	element.addEventListener("dragstart", function (e) {
		if (!e.target.hasAttribute("draggable")) {
			e.preventDefault();
			return;
		}

		markAsDragSourceElement(e.target);
		showTooltip(e);

		document.addEventListener("dragover", updateTooltipPosition);
	});

	element.addEventListener("dragend", function () {
		removeDragSourceAttribute(this);
		removeDragHoverCSSClass(this);

		document.removeEventListener("dragover", updateTooltipPosition);
		hideTooltip();
	});
}

export function makeDropZone(element, allowOnlyExternalDrops = false) {
	element.setAttribute("data-drop-zone", true);

	element.addEventListener("dragenter", e => e.preventDefault());

	if (allowOnlyExternalDrops) {
		element.addEventListener("dragover", allowDropIfExternalContent);
	} else {
		element.addEventListener("dragover", allowDropIfNotDragSourceElement);
	}

	element.addEventListener("dragleave", e => removeDragHoverCSSClassIfNotDragSourceElement(e.target));

	element.addEventListener("drop", drop);
}

function showTooltip(event) {
	let icon = document.querySelector("#drag-icon");
	icon.style.display = "flex";

	if (event.target.classList.contains("file")) {
		icon.classList.add("file");
		icon.classList.remove("folder");
	} else if (
		event.target.classList.contains("folder") ||
		event.target.parentNode.classList.contains("interactive-path-component") ||
		event.target.parentNode.classList.contains("collapsable-folder-structure-element")
	) {
		icon.classList.add("folder");
		icon.classList.remove("file");
	}

	// set the data image to null to show nothing (drag image is translucent by default, so a workaround is needed)
	event.dataTransfer.setDragImage(new Image(), 0, 0);
	// display own icon at cursor position
	icon.style.left = event.pageX + "px";
	icon.style.top = event.pageY + "px";
}

function updateTooltipPosition(event) {
	let icon = document.querySelector("#drag-icon");
	icon.style.left = event.pageX + "px";
	icon.style.top = event.pageY + "px";
}

function hideTooltip() {
	document.querySelector("#drag-icon").style.display = "none";
}

function drop(event) {
	event.preventDefault();
	event.stopPropagation();

	hideTooltip();
	removeDragHoverCSSClass(event.target);

	if (event.dataTransfer.types.includes("Files")) {
		// dragging from other window!
		console.log("EXTERNAL");
	} else {
		// dragging from other windows doesnt set a data-drag-source as no dragstart event is fired
		let dragSourceElement = document.querySelector(`*[${DRAG_SOURCE_ATTRIBUTE}]`);

		if (!dragSourceElement) {
			console.error("something went wrong; no drag source element found");
			return;
		}

		removeDragHoverCSSClass(dragSourceElement);
		removeDragSourceAttribute(dragSourceElement);

		let oldPath = dragSourceElement.querySelector(".path").innerText;
		let part = oldPath.match(/[^\/]+\/?$/gim)[0];
		let newPath = getPathFromDropZone(event.target) + part;

		console.log(oldPath, newPath);
		if (oldPath === newPath) {
			return;
		}

		window.socket.emit("rename", oldPath, newPath, error => {
			if (error) {
				console.log(error);
			} else {
				console.log("successfully moved content");
			}
		});
	}
}

function getPathFromDropZone(element) {
	return (element.querySelector(".path") || element.parentNode.querySelector(".path")).innerText;
}

function removeDragSourceAttribute(element) {
	element.removeAttribute(DRAG_SOURCE_ATTRIBUTE);
}

function preventDroppingContentsFromOtherWindows(event) {
	event.preventDefault();
	event.dataTransfer.dropEffect = "none";
	event.dataTransfer.effectAllowed = "none";
}

function removeDragHoverCSSClassIfNotDragSourceElement(element) {
	if (!element.hasAttribute(DRAG_SOURCE_ATTRIBUTE)) {
		removeDragHoverCSSClass(element);
	}
}

function removeDragHoverCSSClass(element) {
	element.classList.remove(DRAG_HOVER_CSS_CLASS);
}

function allowDropIfExternalContent(event) {
	if (
		!document.querySelector(`*[${DRAG_SOURCE_ATTRIBUTE}]`) ||
		!document.querySelector("#directory-contents #contents").contains(document.querySelector(`*[${DRAG_SOURCE_ATTRIBUTE}`))
	) {
		allowDropIfNotDragSourceElement(event);
	} else {
		removeDragHoverCSSClass(this);
	}
}

function allowDropIfNotDragSourceElement(event) {
	if (!event.target.hasAttribute(DRAG_SOURCE_ATTRIBUTE) && !event.target.classList.contains("file")) {
		allowDrop(event);
	}
}

function allowDrop(event) {
	if (!event.target.classList.contains(DRAG_HOVER_CSS_CLASS)) {
		event.target.classList.add(DRAG_HOVER_CSS_CLASS);
	}
	event.preventDefault();
}

function markAsDragSourceElement(elem) {
	elem.classList.add(DRAG_HOVER_CSS_CLASS);
	elem.setAttribute(DRAG_SOURCE_ATTRIBUTE, true);
}