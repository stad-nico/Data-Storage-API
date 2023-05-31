import { DirectoryContentElement } from "./DirectoryContentElement";
import { DirectoryContentType } from "./DirectoryContentType";

export class DirectoryContentFolder extends DirectoryContentElement {
	constructor(name: string, size: number, lastEdited: Date, relativePath: string) {
		super(DirectoryContentType.Folder, name, size, lastEdited, relativePath);
	}
}
