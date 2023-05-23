const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

export function createSaveLocation() {
	if (process.env.SAVE_LOCATION) {
		fs.access(process.env.SAVE_LOCATION, err => {
			if (err && err.code === "ENOENT") {
				fs.mkdir(process.env.SAVE_LOCATION, err => {
					if (err) {
						console.log("An error occurred trying to create the save location: " + err);
					}
				}); //Create dir in case not found
			} else if (err && err.code !== "EEXIST") {
				console.log("An error occurred trying to create the save location: " + err);
			} else if (err && err.code === "EEXIST") {
				console.log(`Save location already existing at ${process.env.SAVE_LOCATION}`);
			}
		});
	} else {
		let saveLocationPath = "C:\\FILE_SERVER_SAVE_LOCATION";
		process.env["SAVE_LOCATION"] = saveLocationPath;

		fs.mkdir(saveLocationPath, err => {
			if (err) {
				console.log("An error occurred trying to create the save location: " + err);
			} else {
				console.info(`Created save location at ${saveLocationPath}`);
			}
		});
	}
}
