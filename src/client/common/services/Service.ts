export class ServiceCollection {
	/**
	 * Set of registered services
	 */
	protected _services: Set<Service>;

	/**
	 * Creates a new ServiceCollection instance
	 */
	constructor() {
		this._services = new Set<Service>();
	}

	/**
	 * Adds a service to collection
	 *
	 * @param service The service to add to the collection
	 */
	public registerService(service: Service): void {
		this._services.add(service);
	}
}

export interface IService {}

export abstract class Service implements IService {
	protected constructor() {}
}
