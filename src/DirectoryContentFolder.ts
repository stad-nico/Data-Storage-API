import { DirectoryContentElement } from "./DirectoryContentElement";
import { DirectoryContentType } from "./DirectoryContentType";

export class DirectoryContentFolder extends DirectoryContentElement {
	private _contents: DirectoryContentElement[];

	constructor(name: string, size: number, lastEdited: Date, relativePath: string, contents?: DirectoryContentElement[]) {
		super(DirectoryContentType.Folder, name, size, lastEdited, relativePath);

		this._contents = contents;
	}
}
