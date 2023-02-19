import { clearDirectoryContentElements, createDirectoryContentElement } from "./directoryContents.js";
import { createFolderStructureElement, createDefaultDirectoryElement, createFolderStructureElementRecursive } from "./folderStructure.js";
import getFolderElementByPath from "./getFolderElementByPath.js";

export default function registerSocketEventHandlers(socket) {
	socket.on("receive-directory-contents", data => {
		clearDirectoryContentElements();
		if (data.length === 0) {
			document.querySelector("#directory-contents #contents").classList.add("empty");
		} else {
			document.querySelector("#directory-contents #contents").classList.remove("empty");
		}
		for (let element of data) {
			createDirectoryContentElement(element.name, element.size, element.path.replaceAll(/\\/gi, "/"), element.isDirectory);
		}
	});

	socket.on("receive-directory-folder-structure-recursive", data => {
		let parent;

		for (let folderObject of data.folderObjects) {
			if (getFolderElementByPath(folderObject.path)) {
				parent = getFolderElementByPath(folderObject.path);
			} else {
				if (folderObject.path === "/") {
					parent = createDefaultDirectoryElement();
				} else {
					parent = createFolderStructureElement(parent, folderObject.name, folderObject.path, folderObject.hasSubDirectories);
				}
			}

			parent.classList.add("open");
			if (folderObject.contents.length !== 0) {
				parent.classList.remove("contents-not-loaded");

				for (let content of folderObject.contents) {
					if (!getFolderElementByPath(content.path)) {
						createFolderStructureElement(parent, content.name, content.path, content.hasSubDirectories);
					}
				}
			}
		}
	});

	socket.on("receive-directory-folder-structure", data => {
		let folderElement = getFolderElementByPath(data.path);

		for (let entry of data.contents) {
			createFolderStructureElement(folderElement, entry.name, entry.path, entry.hasSubDirectories);
		}
	});

	socket.on("deleted-directory", path => {
		let folderElement = getFolderElementByPath(path);

		if (folderElement) {
			let parentFolderElement = folderElement.parentElement.closest(".collapsable-folder-structure-element");
			getFolderElementByPath(path).remove();
			if (parentFolderElement.querySelector(".content").childElementCount === 0) {
				parentFolderElement.classList.add("no-contents");
			}
		}

		socket.emit("send-directory-contents", window.location.pathname);
	});

	socket.on("created-directory", path => {
		createFolderStructureElementRecursive(path, false);
		socket.emit("send-directory-contents", window.location.pathname);
	});

	socket.on("moved-directory", (oldPath, newPath) => {
		let old = getFolderElementByPath(oldPath);
		old.querySelector(".path").innerText = newPath;
		let newParent = getFolderElementByPath(newPath.replace(/[^\/]+\/$/im, ""));
		let oldParent = getFolderElementByPath(oldPath.replace(/[^\/]+\/$/im, ""));

		newParent.querySelector(".content").append(old);
		newParent.classList.remove("no-contents");
		newParent.classList.add("open");

		if (oldParent.querySelector(".content").childElementCount === 0) {
			oldParent.classList.add("no-contents");
		}

		for (let elem of Array.from(old.querySelectorAll(".collapsable-folder-structure-element"))) {
			elem.querySelector(".path").innerText = elem
				.querySelector(".path")
				.innerText.replace(oldPath.replace(/[^\/]+\/$/im, ""), newPath.replace(/[^\/]+\/$/im, ""));
		}

		socket.emit("send-directory-contents", window.location.pathname);
	});

	socket.on("moved-file", (oldPath, newPath) => {
		socket.emit("send-directory-contents", window.location.pathname);
	});
}
