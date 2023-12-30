import { ConfigService } from '@nestjs/config';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import { Environment } from 'src/env.config';

/**
 * Utility class for path operations
 */
export class PathUtils {
	public static readonly validFileNameRegExp = `([-_.]?[a-zA-Z0-9])([-_. ]?[a-zA-Z0-9])*`;

	public static readonly validDirectoryPathRegExp = new RegExp(
		`^(${this.validFileNameRegExp}[\\\/])*(${this.validFileNameRegExp}[\\\/]?)$`,
		'm'
	);

	/**
	 * Normalize a path by replacing multiple slashes with a single one.
	 * Leading slashes or dots (`../`, `./`, `/`) are removed, a single trailing slash is ensured.
	 *
	 * @param {string} pathToNormalize - the path to normalize
	 * @returns {string} the normalized path
	 */
	public static normalize(pathToNormalize: string): string {
		let result = path.normalize(pathToNormalize + '/');

		result = result.replaceAll(/\s+/g, ' ');
		result = result.replaceAll(/[\/\\]+/g, path.sep);
		result = result.replaceAll(/^\.{0,2}[\/\\]/g, '');

		return result;
	}

	/**
	 * Check if a path exists on the fs by using `fs.access`
	 *
	 * @param {string} path the absolute path to check
	 * @returns {boolean} true if the path exists, otherwise false
	 */
	public static async pathExists(path: string): Promise<boolean> {
		return (await fsPromises.access(path).catch(() => false)) === undefined;
	}

	/**
	 * Check if a path does not leave the directory specified in `env.DISK_STORAGE_PATH` by joining it with `DISK_STORAGE_PATH`
	 *
	 * @example
	 * ```js
	 * process.env.DISK_STORAGE_PATH = "C:/test";
	 *
	 * isPathRelative("t.txt"); // returns true
	 * isPathRelative("../../f.txt"); // returns false
	 * ```
	 *
	 * @param {string} relativePath the path relative to `DISK_STORAGE_PATH` to check
	 * @returns {string} whether the path is relative
	 */
	public static isPathRelative(configService: ConfigService, relativePath: string): boolean {
		const diskPath: string = configService.getOrThrow(Environment.DiskStoragePath);
		const relative = path.relative(diskPath, path.join(diskPath, relativePath));

		return Boolean(relative) && !relative.startsWith('..') && !path.isAbsolute(relative);
	}

	/**
	 * Join a path with an environment variable `env`
	 *
	 * @param {string} relativePath the path to join
	 * @returns {string} the absolute joined path
	 */
	public static join(configService: ConfigService, relativePath: string, env: Environment): string {
		return path.join(configService.getOrThrow(env), relativePath);
	}

	/**
	 * Convert a uuid to a directory path.
	 * The first two chars specify the name of the first directory, the second two chars the name of the second directory
	 * and the rest the filename.
	 *
	 * @example
	 * const uuid = "ded9d04b-b18f-4bce-976d-7a36acb42eb9";
	 * PathUtils.uuidToDirPath(uuid); // returns "de/d9/d04b-b18f-4bce-976d-7a36acb42eb9"
	 *
	 * @param {string} uuid - the uuid to convert
	 * @returns {string} the corresponding directory path
	 */
	public static uuidToDirPath(uuid: string): string {
		return uuid.match(/.{1,2}/g)!.reduce((acc, curr, ind) => (acc += ind === 1 || ind === 2 ? '/' + curr : curr));
	}

	/**
	 * Check if the given path is a valid directory path
	 *
	 * @param {string} path - the path to check
	 * @returns {boolean} whether the path is valid
	 */
	public static isValidDirectoryPath(path: string): boolean {
		console.log(path, PathUtils.validDirectoryPathRegExp);
		return PathUtils.validDirectoryPathRegExp.test(path);
	}
}