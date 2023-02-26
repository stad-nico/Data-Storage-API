import { setCookie } from "./cookies.js";
import { load } from "./navigation.js";
import { makeDraggable, makeDropZone } from "./dropzone.js";

export function createInteractivePathElement() {
	let interactivePathElement = document.createElement("div");
	interactivePathElement.setAttribute("id", "interactive-path");

	let inputElement = document.createElement("input");
	inputElement.classList.add("hidden");
	inputElement.setAttribute("spellcheck", false);

	interactivePathElement.prepend(inputElement);

	interactivePathElement.addEventListener("click", function (event) {
		let inputElement = this.querySelector("input");
		inputElement.classList.remove("hidden");

		this.querySelectorAll("div.interactive-path-component").forEach(x => x.classList.add("hidden"));

		let path = getCompleteRelativePathFromInteractivePathComponent(this.querySelector("div.interactive-path-component:last-of-type"));
		inputElement.value = path;
		inputElement.select();

		event.stopPropagation();
	});

	inputElement.addEventListener("keyup", function (e) {
		if (e.code === "Enter") {
			window.socket.emit("is-path-valid", this.value, valid => {
				if (valid) {
					this.classList.add("hidden");
					window.history.pushState(this.value, "", this.value);
					load();
				} else {
					console.log("NOT VALID");
				}
			});
		}
	});

	return interactivePathElement;
}

export default function setInteractivePath(value) {
	let interactivePathElement = document.querySelector("#interactive-path");
	interactivePathElement.querySelectorAll(".interactive-path-component").forEach(x => x.remove());

	let parts = value.match(/(^\/)|([^\/]+)/gim);

	for (let part of parts) {
		let component = createInteractivePathComponent(part);
		interactivePathElement.append(component);
	}
}

function createInteractivePathComponent(value) {
	let template = document.querySelector("#interactive-path-component-template");

	let interactivePathComponent = template.content.cloneNode(true).querySelector("div.interactive-path-component");
	interactivePathComponent.querySelector(".value").innerText = value;
	let completePath = getCompleteRelativePathFromInteractivePathComponent(interactivePathComponent) + value;
	interactivePathComponent.querySelector(".path").innerText = completePath.endsWith("/") ? completePath : completePath + "/";
	interactivePathComponent.querySelector(".value").addEventListener("click", function (e) {
		e.stopPropagation();

		let path = getCompleteRelativePathFromInteractivePathComponent(this.closest("div.interactive-path-component"));
		window.history.pushState(path, "", path);
		load();
	});

	makeDropZone(interactivePathComponent.querySelector(".value"));
	makeDraggable(interactivePathComponent.querySelector(".value"));

	return interactivePathComponent;
}

function getCompleteRelativePathFromInteractivePathComponent(interactivePathComponent) {
	let componentValues = document.querySelectorAll("#interactive-path div.interactive-path-component .value");
	componentValues = Array.from(componentValues).map(component => component.innerText);
	let stopValue = interactivePathComponent.querySelector(".value").innerText;

	let path = "";
	for (let value of componentValues) {
		path += value === "/" ? value : value + "/";

		if (value === stopValue) {
			break;
		}
	}

	return path;
}
