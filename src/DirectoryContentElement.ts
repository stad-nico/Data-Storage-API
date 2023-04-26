import { DirectoryContentType } from "src/DirectoryContentType";

export class DirectoryContentElement {
	public readonly type: DirectoryContentType;

	public readonly name: string;
	public readonly size: number;
	public readonly lastEdited: Date;

	constructor(type: DirectoryContentType, name: string, size: number, lastEdited: Date) {
		this.type = type;

		this.name = name;
		this.size = size;
		this.lastEdited = lastEdited;
	}
}
