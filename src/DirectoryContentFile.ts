import { DirectoryContentElement } from "./DirectoryContentElement";
import { DirectoryContentType } from "./DirectoryContentType";
import { FileExtension } from "./FileExtension";

export class DirectoryContentFile extends DirectoryContentElement {
	public readonly extension: FileExtension;

	constructor(name: string, size: number, lastEdited: Date, relativePath: string, fileExtension: FileExtension) {
		super(DirectoryContentType.File, name, size, lastEdited, relativePath);

		this.extension = fileExtension;
	}
}
