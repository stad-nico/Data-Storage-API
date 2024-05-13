import { BadRequestException } from '@nestjs/common';
import { PathUtils } from 'src/util/PathUtils';

export class FileNameTooLongException extends BadRequestException {
	public constructor(name: string) {
		super(`file name ${name} exceeds the limit of ${PathUtils.MaxFileNameLength} chars`);
	}
}
