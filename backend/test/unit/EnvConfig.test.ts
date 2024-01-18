import 'reflect-metadata';
import { EnvVariables, NodeEnv, validate } from 'src/EnvConfig';

describe('env.config.ts', () => {
	describe('validate', () => {
		const config: Record<string, unknown> = {
			PORT: 3000,
			STORAGE_PATH: 'storagePath',
			DB_HOST: 'dbHost',
			DB_NAME: 'dbName',
			DB_PASSWORD: 'dbPassword',
			DB_PORT: 4000,
			DB_USERNAME: 'dbUsername',
			NODE_ENV: NodeEnv.Develop,
		};

		it('should validate config', () => {
			expect(() => validate(config)).not.toThrow();
			expect(validate(config)).toBeInstanceOf(EnvVariables);
			expect({ ...validate(config) }).toStrictEqual(config);
		});

		it('should have default value NodeEnv.Develop as NODE_ENV value in config', () => {
			delete process.env.NODE_ENV;
			delete config['NODE_ENV'];

			expect({ ...validate(config) }).toStrictEqual({
				...config,
				NODE_ENV: NodeEnv.Develop,
			});
		});

		it('should have correct NODE_ENV value in config', () => {
			delete config['NODE_ENV'];
			process.env['NODE_ENV'] = 'test';

			expect({ ...validate(config) }).toStrictEqual({
				...config,
				NODE_ENV: NodeEnv.Testing,
			});
		});

		it('should throw error', () => {
			const config: Record<string, unknown> = {};

			expect(() => validate(config)).toThrow();
		});
	});
});