const path = require("path");
const fs = require("fs/promises");

export async function getDirectorySize(directoryPath: string): Promise<number> {
	const files = await fs.readdir(directoryPath);
	const stats = files.map(file => fs.stat(path.join(directoryPath, file)));

	return (await Promise.all(stats)).reduce((accumulator, { size }) => accumulator + size, 0);
}
