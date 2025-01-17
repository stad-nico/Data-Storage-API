import { PathUtils } from 'src/util/PathUtils';

export class FileUploadResponse {
	readonly path: string;

	private constructor(path: string) {
		this.path = path;
	}

	public static from(path: string): FileUploadResponse {
		return new FileUploadResponse(PathUtils.normalizeFilePath(path));
	}
}
