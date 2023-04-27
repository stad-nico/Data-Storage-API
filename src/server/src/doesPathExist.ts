const fs = require("fs/promises");

export async function doesPathExist(absolutePath: string): Promise<boolean> {
	try {
		await fs.access(absolutePath);
		return true;
	} catch (error) {
		return false;
	}
}
