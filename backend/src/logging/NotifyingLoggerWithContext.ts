import { ILogger } from 'src/logging/ILogger';

export class NotifyingLoggerWithContext implements ILogger {
	private readonly loggersToNotify: ILogger[];

	private readonly context: string | undefined;

	public constructor(context: string | undefined, loggersToNotify: ILogger[]) {
		this.context = context;
		this.loggersToNotify = loggersToNotify;
	}

	debug(message: string): void;
	debug(message: string, context: string): void;
	debug(message: string, context?: string): void {
		for (const logger of this.loggersToNotify) {
			logger.debug(message, context ? context : this.context);
		}
	}

	log(message: string): void;
	log(message: string, context: string): void;
	log(message: string, context?: string): void {
		for (const logger of this.loggersToNotify) {
			logger.log(message, context ? context : this.context);
		}
	}

	warn(message: string): void;
	warn(message: string, context: string): void;
	warn(message: string, context?: string): void {
		for (const logger of this.loggersToNotify) {
			logger.warn(message, context ? context : this.context);
		}
	}

	error(message: string): void;
	error(message: string, context: string): void;
	error(message: string, context?: string): void {
		for (const logger of this.loggersToNotify) {
			logger.error(message, context ? context : this.context);
		}
	}

	fatal(message: string): void;
	fatal(message: string, context: string): void;
	fatal(message: string, context?: string): void {
		for (const logger of this.loggersToNotify) {
			logger.fatal(message, context ? context : this.context);
		}
	}

	add(logger: ILogger) {
		this.loggersToNotify.push(logger);
	}
}
