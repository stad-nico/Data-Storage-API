import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Logger,
	Param,
	Patch,
	Post,
	Query,
	Res,
	StreamableFile,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { FilesService } from 'src/api/files/files.service';
import { ServerError } from 'src/util/ServerError';

import { FileDeleteDto, FileDeleteParams, FileDeleteResponse } from 'src/api/files/classes/delete';
import { FileDownloadDto, FileDownloadParams } from 'src/api/files/classes/download';
import { FileMetadataDto, FileMetadataParams, FileMetadataResponse } from 'src/api/files/classes/metadata';
import { FileRenameBody, FileRenameDto, FileRenameParams, FileRenameQueryParams, FileRenameResponse } from 'src/api/files/classes/rename';
import { FileRestoreDto, FileRestoreParams, FileRestoreQueryParams, FileRestoreResponse } from 'src/api/files/classes/restore';
import { FileUploadDto, FileUploadParams, FileUploadQueryParams, FileUploadResponse } from 'src/api/files/classes/upload';

@Controller('files')
export class FilesController {
	private readonly logger = new Logger(FilesController.name);

	private readonly filesService: FilesService;

	constructor(fileService: FilesService) {
		this.filesService = fileService;
	}

	@Post(':id/restore')
	public async restore(@Param() params: FileRestoreParams, @Query() query: FileRestoreQueryParams): Promise<FileRestoreResponse> {
		try {
			const fileRestoreDto = FileRestoreDto.from(params);

			return await this.filesService.restore(fileRestoreDto, query.overwrite);
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

	@Post(':path(*)')
	@UseInterceptors(FileInterceptor('file'))
	public async upload(
		@Param() params: FileUploadParams,
		@Query() query: FileUploadQueryParams,
		@UploadedFile() file: Express.Multer.File
	): Promise<FileUploadResponse> {
		try {
			const fullPath: string = params.path;

			if (!file) {
				throw new ServerError('file must not be empty', HttpStatus.BAD_REQUEST);
			}

			const fileUploadDto = FileUploadDto.from(fullPath, file);

			return await this.filesService.upload(fileUploadDto, query.overwrite);
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

			return await this.filesService.metadata(fileMetadataDto);
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

			const result = await this.filesService.download(fileDownloadDto);

			res.header({
				'Content-Type': result.mimeType,
				'Content-Disposition': `attachment; filename=${result.name}`,
			});

			result.readableStream.on('error', () => {
				res.header({
					'Content-Type': 'application/json',
				})
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.json(new ServerError('something went wrong', HttpStatus.INTERNAL_SERVER_ERROR).toHttpException().getResponse());
			});

			return new StreamableFile(result.readableStream);
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
	public async rename(
		@Param() params: FileRenameParams,
		@Query() query: FileRenameQueryParams,
		@Body() body: FileRenameBody
	): Promise<FileRenameResponse> {
		try {
			const fileRenameDto = FileRenameDto.from(params, body);

			return await this.filesService.rename(fileRenameDto, query.overwrite);
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
	public async delete(@Param() params: FileDeleteParams): Promise<FileDeleteResponse> {
		try {
			const fileDeleteDto = FileDeleteDto.from(params);

			return await this.filesService.delete(fileDeleteDto);
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
