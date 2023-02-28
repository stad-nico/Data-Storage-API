export enum ComponentIdentifier {
	DOMComponent = "interface.components.dom",
}

export interface ComponentArgs {
	parent?: Component;
}

export abstract class Component {
	/**
	 * The unique component identifier
	 */
	protected readonly _identifier: ComponentIdentifier;

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
	protected constructor(identifier: ComponentIdentifier, parent?: Component) {
		this._identifier = identifier;
		this._parent = parent;
		this._children = [];
	}

	/**
	 * This function must be overwritten by extending classes. It will be called by the UserInterfaceService to instantiate Components
	 *
	 * @param args ComponentArgs
	 */
	public abstract create(args: ComponentArgs): void;

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
	public getIdentifier(): ComponentIdentifier {
		return this._identifier;
	}
}

export interface DOMComponentArgs extends ComponentArgs {
	documentElement: HTMLElement;
}

export class DOMComponent extends Component {
	/**
	 * The document element that represents the main entry that Child components are injected into.
	 */
	private _documentElement: HTMLElement;

	/**
	 * Creates a new DOMComponent
	 */
	constructor() {
		super(ComponentIdentifier.DOMComponent);
	}

	/**
	 * This function will be called by the UserInterfaceService.
	 *
	 * @param args DOMComponentArgs
	 */
	public override create(args: DOMComponentArgs): DOMComponent {
		this._documentElement = args.documentElement;

		return this;
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

export const ComponentMap = {
	[ComponentIdentifier.DOMComponent]: DOMComponent,
};
