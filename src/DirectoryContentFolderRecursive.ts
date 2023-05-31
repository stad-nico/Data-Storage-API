import { DirectoryContentFolder } from "./DirectoryContentFolder";
import { DirectoryContentElement } from "./DirectoryContentElement";

export class DirectoryContentFolderRecursive extends DirectoryContentFolder {
	public readonly contents: DirectoryContentElement[];

	constructor(name: string, size: number, lastEdited: Date, relativePath: string, contents: DirectoryContentElement[] = []) {
		super(name, size, lastEdited, relativePath);

		this.contents = contents;
	}

	public add(element: DirectoryContentElement): void {
		this.contents.push(element);
	}
}
