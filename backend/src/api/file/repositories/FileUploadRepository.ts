import { Injectable } from '@nestjs/common';
import { CommonFileRepository, ICommonFileRepository } from 'src/api/file/repositories/CommonFileRepository';
import { File } from 'src/db/entities/File';

export interface IFileUploadRepository extends ICommonFileRepository {
	getUuidByPathAndNotRecycled(path: string): Promise<Pick<File, 'uuid'>>;
	hardDeleteByUuid(uuid: string): Promise<void>;
	insertAndSelectUuidAndPath(file: unknown): Promise<{ uuid: string; path: string }>;
}

@Injectable()
export class FileUploadRepository extends CommonFileRepository implements IFileUploadRepository {
	public async getUuidByPathAndNotRecycled(path: string): Promise<Pick<File, 'uuid'>> {
		return super.selectByPathAndColumns(path, { isRecycled: false }, ['uuid']);
	}

	public override async hardDeleteByUuid(uuid: string): Promise<void> {
		return super.hardDeleteByUuid(uuid);
	}

	public async insertAndSelectUuidAndPath(file: unknown): Promise<{ uuid: string; path: string }> {
		return 0 as any;
	}
}