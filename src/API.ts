import { DirectoryContentType } from "common/DirectoryContentType";

export interface API {
	getDirectoryContents(path: string, contentType: DirectoryContentType): void;
	isPathValid(path: string): boolean;
}
