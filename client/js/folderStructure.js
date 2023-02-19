import { getCookie, setCookie } from "./cookies.js";
import setInteractivePath from "./interactivePath.js";
import { load } from "./navigation.js";
import { makeDraggable, makeDropZone } from "./dropzone.js";
import getFolderElementByPath from "./getFolderElementByPath.js";

export function createFolderStructureElementRecursive(path, hasSubDirectories) {
	let paths = [path];

	while (path !== "/") {
		path = path.replace(/[^\/]+\/$/im, "");
		paths.unshift(path);
	}

	let parent = document.querySelector("#folder-structure");

	for (let path of paths) {
		if (getFolderElementByPath(path)) {
			parent = getFolderElementByPath(path);
		} else {
			if (path === "/") {
				createDefaultDirectoryElement();
			} else {
				parent = createFolderStructureElement(
					parent,
					path.match(/[^\/]+(?=\/$)/m)[0],
					path,
					paths.indexOf(path) === paths.length - 1 ? hasSubDirectories : true
				);
			}
		}

		if (paths.indexOf(path) !== paths.length - 1) {
			parent.classList.add("open");
			parent.classList.remove("no-contents");
		}
	}
}

export function createFolderStructureElement(parentDirectoryElement, name, relPath, hasSubDirectories) {
	let template = document.querySelector("#folder-structure-folder-template");

	let folder = template.content.cloneNode(true).querySelector(".collapsable-folder-structure-element");
	folder.querySelector(".name").innerText = name;

	let path = relPath.endsWith("/") ? relPath : relPath + "/";
	folder.querySelector(".path").innerText = path;
	folder.classList.add("contents-not-loaded");

	folder.querySelector(".head").addEventListener("click", function () {
		openFolder(this.parentNode);
	});

	folder.querySelector(".open-in-new-tab-icon").setAttribute("href", path);

	if (hasSubDirectories) {
		folder.querySelector(".expand-icon").addEventListener("click", function (e) {
			e.stopPropagation();

			toggleFolder(folder);
		});
	} else {
		folder.classList.add("no-contents");
	}

	folder.addEventListener("contextmenu", function (e) {
		e.preventDefault();

		document.querySelector("#folder-structure-context-menu").removeAttribute("hidden");
		let contextMenus = document.querySelector("#context-menus");
		contextMenus.removeAttribute("hidden");
		contextMenus.style.top = e.clientY;
		contextMenus.style.left = e.clientX;

		document.addEventListener("mousedown", function (e) {
			document.querySelector("#folder-structure-context-menu").setAttribute("hidden", true);
			document.querySelector("#context-menus").setAttribute("hidden", true);
		});
	});

	makeDraggable(folder.querySelector(".head"));
	makeDropZone(folder.querySelector(".head"));

	let elements = Array.from(parentDirectoryElement.querySelector(".content").querySelectorAll(".collapsable-folder-structure-element"));
	let names = elements.map(x => x.querySelector(".head .name").innerText);
	names.push(name);
	names = names.sort();

	let prev = elements.find(x => x.querySelector(".head .name").innerText === names[names.indexOf(name) + 1]);

	parentDirectoryElement.querySelector(".content").insertBefore(folder, prev);

	return folder;
}

export function createDefaultDirectoryElement() {
	let template = document.querySelector("#folder-structure-folder-template");

	let folder = template.content.cloneNode(true).querySelector(".collapsable-folder-structure-element");
	folder.querySelector(".name").innerText = "/";
	folder.querySelector(".path").innerText = "/";
	folder.classList.add("open");

	folder.querySelector(".head").addEventListener("click", function () {
		openFolder(this.parentNode);
	});

	folder.querySelector(".head").ondragstart = e => {
		e.preventDefault();
	};

	let openInNew = folder.querySelector(".open-in-new-tab-icon");
	openInNew.setAttribute("href", "/");
	openInNew.ondragstart = e => {
		e.preventDefault();
	};

	folder.querySelector(".expand-icon").addEventListener("click", function (e) {
		e.stopPropagation();

		toggleFolder(this.closest(".collapsable-folder-structure-element"));
	});

	makeDropZone(folder.querySelector(".head"));

	document.querySelector("#folder-structure").appendChild(folder);

	return folder;
}

export function clearFolderStructureElements(smooth = false) {
	if (!smooth) {
		document.querySelector("#folder-structure").replaceChildren();
		return;
	}
}

async function toggleFolder(folder) {
	folder.classList.toggle("open");

	if (folder.classList.contains("contents-not-loaded")) {
		try {
			await loadContents(folder);
			folder.classList.remove("contents-not-loaded");
		} catch (e) {
			console.log(e);
		}
	}
}

async function loadContents(folder) {
	window.socket.emit("send-directory-folder-structure", folder.querySelector(".path").innerText, error => {
		if (error) {
			console.log(error);
		} else {
			console.log("successfully loaded directory folder structure");
		}
	});
}

async function openFolder(folderElem) {
	folderElem.classList.add("open");
	let path = folderElem.querySelector(".path").innerText;
	window.history.pushState(path, "", path);
	load();
}
