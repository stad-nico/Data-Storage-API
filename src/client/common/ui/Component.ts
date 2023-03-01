export interface ComponentArgs {
	parent?: Component;
}

export abstract class Component {
	/**
	 * The unique component identifier
	 */
	private readonly _identifier: string;

	/**
	 * The parent
	 */
	protected _parent: Component | undefined;

	/**
	 * Child components
	 */
	protected _children: Component[];

	/**
	 * Creates a new Component
	 *
	 * @param parent The parent
	 */
	protected constructor(identifier: string, parent?: Component) {
		this._identifier = identifier;
		this._parent = parent;
		this._children = [];

		this._parent?.append(this);
	}

	/**
	 * Set the parent
	 *
	 * @param parent The Parent
	 */
	public setParent(parent: Component): void {
		this._parent = parent;
	}

	/**
	 * Get the parent
	 *
	 */
	public getParent(): Component | undefined {
		return this._parent;
	}

	/**
	 * Get the ComponentIdentifier
	 */
	public getIdentifier(): string {
		return this._identifier;
	}

	public append(component: Component) {
		this._children.push(component);
	}
}

export abstract class ComponentCollection<ComponentType> {
	/**
	 * Internal map that stores Components by their id
	 */
	protected _components: Map<string, ComponentType>;

	/**
	 * Creates a new ComponentCollection
	 */
	protected constructor() {
		this._components = new Map<string, ComponentType>();
	}

	/**
	 * Set a new Component
	 *
	 * @param id Component id
	 * @param component Component
	 */
	public setComponent(id: string, component: ComponentType) {
		this._components.set(id, component);
	}

	/**
	 * Returns a Component by its id
	 *
	 * @param id Component id
	 */
	public getComponent(id: string): ComponentType | undefined {
		return this._components.get(id);
	}

	/**
	 * Returns an array of key-value pairs of a Component and its id
	 */
	public getComponentsAsArray(): [string, ComponentType][] {
		return Array.from(this._components);
	}
}
