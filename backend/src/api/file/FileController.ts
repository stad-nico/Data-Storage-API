import { Response } from 'express';

import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Inject,
	Logger,
	Param,
	Patch,
	Post,
	Put,
	Res,
	StreamableFile,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { IFileService } from 'src/api/file/IFileService';
import { FileDeleteDto, FileDeleteParams } from 'src/api/file/mapping/delete';
import { FileDownloadDto, FileDownloadParams } from 'src/api/file/mapping/download';
import { FileMetadataDto, FileMetadataParams, FileMetadataResponse } from 'src/api/file/mapping/metadata';
import { FileRenameBody, FileRenameDto, FileRenameParams, FileRenameResponse } from 'src/api/file/mapping/rename';
import { FileReplaceDto } from 'src/api/file/mapping/replace/FileReplaceDto';
import { FileReplaceParams } from 'src/api/file/mapping/replace/FileReplaceParams';
import { FileReplaceResponse } from 'src/api/file/mapping/replace/FileReplaceResponse';
import { FileUploadDto, FileUploadParams, FileUploadResponse } from 'src/api/file/mapping/upload';
import { ServerError } from 'src/util/ServerError';

/**
 * Controller for handling http requests on `/file/`.
 * @class
 */
@Controller('file')
export class FileController {
	private readonly logger = new Logger(FileController.name);

	/**
	 * The file service for handling the request processing and response generation.
	 * @type {FileService}
	 */
	private readonly fileService: IFileService;

	/**
	 * Creates a new FileController instance.
	 * @public @constructor
	 *
	 * @param   {IFileService}    fileService the fileService
	 * @returns {FileController}              the FileController instance
	 */
	public constructor(@Inject(IFileService) fileService: IFileService) {
		this.fileService = fileService;
	}

	@Post(':path(*)')
	@UseInterceptors(FileInterceptor('file'))
	public async upload(@Param() params: FileUploadParams, @UploadedFile() file: Express.Multer.File): Promise<FileUploadResponse> {
		try {
			const fileUploadDto = FileUploadDto.from(params, file);

			return await this.fileService.upload(fileUploadDto);
		} catch (e) {
			if (e instanceof ServerError) {
				this.logger.error(e.message);
				throw e.toHttpException();
			} else {
				this.logger.error(e);
				throw new ServerError('something went wrong', HttpStatus.INTERNAL_SERVER_ERROR).toHttpException();
			}
		}
	}

	@Put(':path(*)')
	@UseInterceptors(FileInterceptor('file'))
	public async replace(@Param() params: FileReplaceParams, @UploadedFile() file: Express.Multer.File): Promise<FileReplaceResponse> {
		try {
			const fileReplaceDto = FileReplaceDto.from(params, file);

			return await this.fileService.replace(fileReplaceDto);
		} catch (e) {
			if (e instanceof ServerError) {
				this.logger.error(e.message);
				throw e.toHttpException();
			} else {
				this.logger.error(e);
				throw new ServerError('something went wrong', HttpStatus.INTERNAL_SERVER_ERROR).toHttpException();
			}
		}
	}

	@Get(':path(*)/metadata')
	public async metadata(@Param() params: FileMetadataParams): Promise<FileMetadataResponse> {
		try {
			const fileMetadataDto = FileMetadataDto.from(params);

			return await this.fileService.metadata(fileMetadataDto);
		} catch (e) {
			if (e instanceof ServerError) {
				this.logger.error(e.message);
				throw e.toHttpException();
			} else {
				this.logger.error(e);
				throw new ServerError('something went wrong', HttpStatus.INTERNAL_SERVER_ERROR).toHttpException();
			}
		}
	}

	@Get(':path(*)/download')
	public async download(@Param() params: FileDownloadParams, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
		try {
			const fileDownloadDto = FileDownloadDto.from(params);

			const result = await this.fileService.download(fileDownloadDto);

			res.header({
				'Content-Type': result.mimeType,
				'Content-Disposition': `attachment; filename=${result.name}`,
			});

			return new StreamableFile(result.readable);
		} catch (e) {
			if (e instanceof ServerError) {
				this.logger.error(e.message);
				throw e.toHttpException();
			} else {
				this.logger.error(e);
				throw new ServerError('something went wrong', HttpStatus.INTERNAL_SERVER_ERROR).toHttpException();
			}
		}
	}

	@Patch(':path(*)')
	public async rename(@Param() params: FileRenameParams, @Body() body: FileRenameBody): Promise<FileRenameResponse> {
		try {
			const fileRenameDto = FileRenameDto.from(params, body);

			return await this.fileService.rename(fileRenameDto);
		} catch (e) {
			if (e instanceof ServerError) {
				this.logger.error(e.message);
				throw e.toHttpException();
			} else {
				this.logger.error(e);
				throw new ServerError('something went wrong', HttpStatus.INTERNAL_SERVER_ERROR).toHttpException();
			}
		}
	}

	@Delete(':path(*)')
	public async delete(@Param() params: FileDeleteParams): Promise<void> {
		try {
			const fileDeleteDto = FileDeleteDto.from(params);

			await this.fileService.delete(fileDeleteDto);
		} catch (e) {
			if (e instanceof ServerError) {
				this.logger.error(e.message);
				throw e.toHttpException();
			} else {
				this.logger.error(e);
				throw new ServerError('something went wrong', HttpStatus.INTERNAL_SERVER_ERROR).toHttpException();
			}
		}
	}
}
