import { setCookie, getCookie } from "./cookies.js";
import setInteractivePath from "./interactivePath.js";
import { load } from "./navigation.js";
import { makeDraggable, makeDropZone } from "./dropzone.js";
import getFolderElementByPath from "./getFolderElementByPath.js";

export function clearDirectoryContentElements() {
	document.querySelector("#directory-contents #contents").replaceChildren();
}

export function createDirectoryContentElement(filename, size, path, isDirectory = false) {
	let elem;

	if (isDirectory) {
		elem = createFolderElement(filename, path);
	} else {
		elem = createFileElement(filename, size, path);
	}

	document.querySelector("#directory-contents #contents").appendChild(elem);
}

function createFolderElement(name, path) {
	let template = document.querySelector("#directory-content-folder-template");

	let folderElement = template.content.cloneNode(true).querySelector("div");
	folderElement.querySelector(".name").innerText = name;
	folderElement.querySelector(".path").innerText = path;

	folderElement.addEventListener("click", function () {
		if (!this.closest(".folder").classList.contains("active")) {
			document.querySelectorAll(".folder.active").forEach(elem => elem.classList.remove("active"));
			this.closest(".folder").classList.add("active");
			return;
		} else {
			window.history.pushState(path, "", path);
			load();
		}
	});

	folderElement.querySelector("div.delete-icon").addEventListener("click", function (event) {
		event.stopPropagation();

		let d = window.confirm("Delete?");

		if (!d) {
			return;
		}

		getFolderElementByPath(this.closest(".folder").querySelector(".path").innerText).setAttribute("data-deleted", true);
		window.socket.emit("delete-directory", this.closest(".folder").querySelector(".path").innerText, error => {
			if (error) {
				console.log(error);
			} else {
				console.log("successfully removed dir");
			}
		});
	});

	makeDraggable(folderElement);
	makeDropZone(folderElement);

	return folderElement;
}

function createFileElement(name, size, path) {
	let template = document.querySelector("#directory-content-file-template");

	let fileElement = template.content.cloneNode(true).querySelector("div");
	fileElement.querySelector(".name").innerText = getFileName(name);
	fileElement.querySelector(".extension").innerText = getFileExtension(name);
	fileElement.querySelector(".size").innerText = getFileSizeWithPrefix(size);
	fileElement.querySelector("a").setAttribute("href", "/download?path=" + encodeURIComponent(window.location.pathname + name));
	fileElement.querySelector("a").setAttribute("target", "_blank");
	fileElement.querySelector(".path").innerText = path;

	makeDraggable(fileElement);

	return fileElement;
}

function getFileExtension(filename) {
	let match = filename.match(/\.([a-zA-Z])+$/m);

	if (match !== null && match[0]) {
		return match[0];
	}

	return "";
}

function getFileName(filename) {
	return filename.replace(getFileExtension(filename), "");
}

let sizePrefixes = ["", "K", "M", "G"];

function getFileSizeWithPrefix(size) {
	let length = size.toString().length;
	let short = size / Math.pow(10, 3 * Math.floor(length / 3));
	short = Math.ceil(short);

	let prefix = sizePrefixes[Math.floor(length / 3)];

	return short + " " + prefix + "B";
}
