/**-------------------------------------------------------------------------
 * Copyright (c) 2024 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DirectoryModule } from 'src/api/directory/DirectoryModule';
import { FileModule } from 'src/api/file/FileModule';
import { validate } from 'src/config/EnvConfig';
import { DiskModule } from 'src/disk/DiskModule';

export const AppModuleConfig = {
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `${process.env.NODE_ENV ?? 'dev'}.env`,
			expandVariables: true,
			validate: validate,
		}),

		MikroOrmModule.forRoot(),

		DiskModule.forRootAsync(),

		FileModule,
		DirectoryModule,
	],
};

@Module(AppModuleConfig)
export class AppModule {}
