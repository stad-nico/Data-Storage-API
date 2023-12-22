import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

export enum NodeEnv {
	Develop = 'dev',
	Production = 'prod',
	Testing = 'test',
}

export class EnvVariables {
	@IsNumber()
	PORT!: number;

	@IsString()
	DISK_STORAGE_PATH!: string;

	@IsString()
	DISK_RECYCLE_PATH!: string;

	@IsEnum(NodeEnv)
	NODE_ENV!: NodeEnv;
}

export enum Environment {
	Port = 'PORT',
	DiskStoragePath = 'DISK_STORAGE_PATH',
	DiskRecyclePath = 'DISK_RECYCLE_PATH',
	NodeENV = 'NODE_ENV',
	DBHost = 'DB_HOST',
	DBPort = 'DB_PORT',
	DBName = 'DB_NAME',
	DBPassword = 'DB_PASSWORD',
	DBUsername = 'DB_USERNAME',
	DBConnectionRetries = 'DB_CONNECTION_RETRIES',
}

export function validate(config: Record<string, unknown>) {
	config['NODE_ENV'] = (process.env.NODE_ENV ?? NodeEnv.Develop).trim();

	const validatedConfig = plainToInstance(EnvVariables, config, { enableImplicitConversion: true });
	const errors = validateSync(validatedConfig, { skipMissingProperties: false });

	if (errors.length > 0) {
		throw new Error(errors.toString());
	}

	return validatedConfig;
}