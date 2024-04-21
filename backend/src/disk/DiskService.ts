import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { statfs } from 'fs/promises';
import * as path from 'path';

import { Environment, NodeEnv } from 'src/config/EnvConfig';
import { FileUtils } from 'src/util/FileUtils';
import { PathUtils } from 'src/util/PathUtils';

export enum StoragePath {
	Data = 'data',
}

/**
 * Service for initializing the storage location of the application.
 * @class
 */
@Injectable()
export class DiskService {
	private readonly logger = new Logger(DiskService.name);

	/**
	 * The complete, absolute path to the storage location loaded from env.
	 * @type {string}
	 */
	private readonly storageLocationPath: string;

	/**
	 * Whether the storage location will be removed on application shutdown.
	 * @type {boolean}
	 */
	private readonly shouldCleanupOnShutdown: boolean;

	/**
	 * Creates a new DiskService instance.
	 * @constructor
	 *
	 * @param   {ConfigService} configService the configService
	 * @returns {DiskService}                 the DiskService instance
	 */
	public constructor(configService: ConfigService) {
		this.storageLocationPath = configService.getOrThrow(Environment.StoragePath);
		this.shouldCleanupOnShutdown = configService.getOrThrow(Environment.NodeENV) !== NodeEnv.Production;
	}

	public async beforeApplicationShutdown(): Promise<void> {
		if (!this.shouldCleanupOnShutdown) {
			return;
		}

		this.logger.log('Cleaning up...');

		await FileUtils.deleteDirectoryOrFail(this.storageLocationPath);

		this.logger.log('Finished cleaning up');
	}

	public async init(): Promise<void> {
		await this.initStorageLocation();
	}

	private async initStorageLocation(): Promise<void> {
		if (!(await PathUtils.pathExists(this.storageLocationPath))) {
			try {
				this.logger.log(`Trying to initialize storage location '${this.storageLocationPath}' ...`);

				await FileUtils.createDirectoryIfNotPresent(this.storageLocationPath);
				await FileUtils.createDirectoryIfNotPresent(path.join(this.storageLocationPath, StoragePath.Data));

				this.logger.log('Successfully initialized storage location');
			} catch (e) {
				throw new Error(`Could not create storage location '${this.storageLocationPath}': ${e}`);
			}
		}

		const stats = await statfs(this.storageLocationPath);
		const freeSpace = stats.bsize * stats.bfree;

		this.logger.log(`Storage location ${this.storageLocationPath} has ${this.formatBytes(freeSpace)} of free space`);
	}

	// https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
	private formatBytes(bytes: number, decimals: number = 2): string {
		if (!+bytes) return '0 Bytes';

		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
	}
}
