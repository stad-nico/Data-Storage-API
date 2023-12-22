import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { File } from 'src/db/entities/File';
import { Environment } from 'src/env.config';
import { FileUtils } from 'src/util/FileUtils';
import { ServerError } from 'src/util/ServerError';

import { FileDeleteDto, FileDeleteResponse } from 'src/api/file/mapping/delete';
import { FileDownloadDto, FileDownloadResponse } from 'src/api/file/mapping/download';
import { FileMetadataDto, FileMetadataResponse } from 'src/api/file/mapping/metadata';
import { FileRenameDto, FileRenameResponse } from 'src/api/file/mapping/rename';
import { FileRestoreDto, FileRestoreResponse } from 'src/api/file/mapping/restore';
import { FileUploadDto, FileUploadResponse } from 'src/api/file/mapping/upload';

import { createReadStream } from 'fs';
import * as fsPromises from 'fs/promises';
import { lookup } from 'mime-types';
import * as path from 'path';
import { IFileDeleteRepository } from 'src/api/file/repositories/FileDeleteRepository';
import { IFileDownloadRepository } from 'src/api/file/repositories/FileDownloadRepository';
import { IFileMetadataRepository } from 'src/api/file/repositories/FileMetadataRepository';
import { IFileRenameRepository } from 'src/api/file/repositories/FileRenameRepository';
import { IFileUploadRepository } from 'src/api/file/repositories/FileUploadRepository';

@Injectable()
export class FileService {
	private readonly logger = new Logger(FileService.name);

	private readonly configService: ConfigService;

	private readonly fileUploadRepository: IFileUploadRepository;

	private readonly fileMetadataRepository: IFileMetadataRepository;

	private readonly fileDownloadRepository: IFileDownloadRepository;

	private readonly fileDeleteRepository: IFileDeleteRepository;

	private readonly fileRenameRepository: IFileRenameRepository;

	constructor(
		configService: ConfigService,
		fileUploadRepository: IFileUploadRepository,
		fileMetadataRepository: IFileMetadataRepository,
		fileDownloadRepository: IFileDownloadRepository,
		fileDeleteRepository: IFileDeleteRepository
	) {
		this.configService = configService;
		this.fileUploadRepository = fileUploadRepository;
		this.fileMetadataRepository = fileMetadataRepository;
		this.fileDownloadRepository = fileDownloadRepository;
		this.fileDeleteRepository = fileDeleteRepository;
	}

	public async upload(fileUploadDto: FileUploadDto, overwrite: boolean = false): Promise<FileUploadResponse> {
		return await this.fileUploadRepository.transactional(async () => {
			const existingFile = await this.fileUploadRepository.getUuidByPathAndNotRecycled(fileUploadDto.fullPath);

			if (!overwrite && existingFile) {
				throw new ServerError(`file at ${fileUploadDto.fullPath} already exists`, HttpStatus.CONFLICT);
			}

			if (!FileUtils.isPathRelative(this.configService, fileUploadDto.fullPath)) {
				throw new ServerError(`path must be a valid file path`, HttpStatus.BAD_REQUEST);
			}

			if (overwrite && existingFile) {
				await this.fileUploadRepository.hardDeleteByUuid(existingFile.uuid);

				try {
					const existingFilePath = FileUtils.join(
						this.configService,
						FileUtils.uuidToDirPath(existingFile.uuid),
						Environment.DiskStoragePath
					);

					await fsPromises.rm(existingFilePath);
				} catch (e) {
					this.logger.warn(`Failed to delete file ${existingFile.uuid} from save location: ${e}`);
				}
			}

			const result = await this.fileUploadRepository.insertAndSelectUuidAndPath(fileUploadDto.toFile());

			const resolvedPath = FileUtils.join(this.configService, FileUtils.uuidToDirPath(result.uuid), Environment.DiskStoragePath);
			await FileUtils.writeFile(resolvedPath, fileUploadDto.buffer);

			return FileUploadResponse.from(result.path);
		});
	}

	public async metadata(fileMetadataDto: FileMetadataDto): Promise<FileMetadataResponse> {
		return await this.fileMetadataRepository.transactional(async () => {
			const fileToFetch = await this.fileMetadataRepository.getFullByPathAndNotRecycled(fileMetadataDto.path);

			if (!fileToFetch) {
				throw new ServerError(`file at ${fileMetadataDto.path} does not exist`, HttpStatus.NOT_FOUND);
			}

			return FileMetadataResponse.from(fileToFetch);
		});
	}

	public async download(fileDownloadDto: FileDownloadDto): Promise<FileDownloadResponse> {
		return await this.fileDownloadRepository.transactional(async () => {
			const fileToDownload = await this.fileDownloadRepository.getByPathAndNotRecycled(fileDownloadDto.path);

			if (!fileToDownload) {
				throw new ServerError(`file at ${fileDownloadDto.path} does not exist`, HttpStatus.NOT_FOUND);
			}

			const diskPath = FileUtils.join(this.configService, FileUtils.uuidToDirPath(fileToDownload.uuid), Environment.DiskStoragePath);

			if (!(await FileUtils.pathExists(diskPath))) {
				throw new ServerError(`file at ${fileDownloadDto.path} does not exist`, HttpStatus.NOT_FOUND);
			}

			return FileDownloadResponse.from(fileToDownload.name, fileToDownload.mimeType, createReadStream(diskPath));
		});
	}

	public async delete(fileDeleteDto: FileDeleteDto): Promise<FileDeleteResponse> {
		return await this.fileDeleteRepository.transactional(async () => {
			const fileToDelete = await this.fileDeleteRepository.getUuidByPathAndNotRecycled(fileDeleteDto.path);

			if (!fileToDelete) {
				throw new ServerError(`file at ${fileDeleteDto.path} does not exist`, HttpStatus.NOT_FOUND);
			}

			await this.fileDeleteRepository.softDelete(fileToDelete.uuid);

			const sourcePath = FileUtils.join(this.configService, FileUtils.uuidToDirPath(fileToDelete.uuid), Environment.DiskStoragePath);
			const destinationPath = FileUtils.join(
				this.configService,
				FileUtils.uuidToDirPath(fileToDelete.uuid),
				Environment.DiskRecyclePath
			);
			await FileUtils.copyFile(sourcePath, destinationPath);

			try {
				await fsPromises.rm(sourcePath);
			} catch (e) {
				this.logger.warn(`Failed to delete file ${fileToDelete.uuid} from recycle location: ${e}`);
			}

			return FileDeleteResponse.from(fileToDelete.uuid);
		});
	}

	public async restore(fileRestoreDto: FileRestoreDto, overwrite: boolean = false): Promise<FileRestoreResponse> {
		return await this.entityManager.transactional(async (entityManager) => {
			const fileToRestore = await entityManager.findOne(File, { uuid: fileRestoreDto.uuid, isRecycled: true });

			if (!fileToRestore) {
				throw new ServerError(`uuid ${fileRestoreDto.uuid} does not exist`, HttpStatus.NOT_FOUND);
			}

			const existingFile = await entityManager.findOne(File, { fullPath: fileToRestore.fullPath, isRecycled: false });

			if (!overwrite && existingFile) {
				throw new ServerError(`file at ${fileToRestore.fullPath} already exists`, HttpStatus.CONFLICT);
			}

			if (overwrite && existingFile) {
				await entityManager.nativeDelete(File, { uuid: existingFile.uuid });
			}

			await entityManager.nativeUpdate(File, { uuid: fileToRestore.uuid }, { isRecycled: false });

			const sourcePath = FileUtils.join(this.configService, fileToRestore.getUuidAsDirPath(), Environment.DiskRecyclePath);
			const destinationPath = FileUtils.join(this.configService, fileToRestore.getUuidAsDirPath(), Environment.DiskStoragePath);
			await FileUtils.copyFile(sourcePath, destinationPath);

			try {
				await fsPromises.rm(sourcePath);
			} catch (e) {
				this.logger.warn(`Failed to delete file ${fileToRestore.uuid} (${fileToRestore.fullPath}) from recycle location: ${e}`);
			}

			return FileRestoreResponse.from(fileToRestore);
		});
	}

	public async rename(fileRenameDto: FileRenameDto, overwrite: boolean = false): Promise<FileRenameResponse> {
		return await this.fileRenameRepository.transactional(async () => {
			const fileToRename = await this.fileRenameRepository.selectSizeAndUuidByPathAndNotRecycled(fileRenameDto.sourcePath);

			if (!fileToRename) {
				throw new ServerError(`file at ${fileRenameDto.sourcePath} does not exist`, HttpStatus.NOT_FOUND);
			}

			const existingFile = await this.fileRenameRepository.getUuidByPathAndNotRecycled(fileRenameDto.destinationPath);

			if (!FileUtils.isPathRelative(this.configService, fileRenameDto.destinationPath)) {
				throw new ServerError(`newPath must be a valid file path`, HttpStatus.BAD_REQUEST);
			}

			if (!overwrite && existingFile) {
				throw new ServerError(`file at ${fileRenameDto.destinationPath} already exists`, HttpStatus.CONFLICT);
			}

			if (overwrite && existingFile) {
				await this.fileRenameRepository.hardDeleteByUuid(existingFile.uuid);
			}

			const file = new File(
				fileRenameDto.destinationPath,
				path.basename(fileRenameDto.destinationPath),
				path.dirname(fileRenameDto.destinationPath),
				lookup(fileRenameDto.destinationPath) || 'application/octet-stream',
				fileToRename.size,
				false,
				fileToRename.uuid
			);

			const result = await entityManager.upsert(File, file);

			return FileRenameResponse.from(result);
		});
	}
}