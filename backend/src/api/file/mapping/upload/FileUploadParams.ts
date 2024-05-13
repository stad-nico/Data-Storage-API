import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { PathUtils } from 'src/util/PathUtils';

/**
 * Class representing the http request url params.
 * @class
 */
export class FileUploadParams {
	/**
	 * The path of the file to create.
	 * @type {string}
	 */
	@Matches(PathUtils.ValidFilePathRegExp)
	@ApiProperty({
		example: '/path/to/file.txt',
		description: 'The path of the file to upload',
		pattern: `${PathUtils.ValidFilePathRegExp}`,
	})
	readonly path: string;

	/**
	 * Creates a new FileUploadParams instance.
	 * @private @constructor
	 *
	 * @param   {string}                 path the path of the file
	 * @returns {FileUploadParams}            the FileUploadParams instance
	 */
	private constructor(path: string) {
		this.path = path;
	}
}
