import { load } from "./navigation.js";
import registerSocketEventHandlers from "./socketEventHandler.js";
import { makeDropZone } from "./dropzone.js";

window.onload = () => {
	makeDropZone(document.querySelector("#directory-contents #contents"), true);

	let pathname = window.location.pathname;

	const socket = io();
	window.socket = socket;

	registerSocketEventHandlers(socket);

	socket.emit("is-path-valid", pathname, valid => {
		if (valid) {
			console.log("path is valid");
			load();
		} else {
			console.log("path is not valid");
		}
	});
};

window.onpopstate = () => {
	load();
};
