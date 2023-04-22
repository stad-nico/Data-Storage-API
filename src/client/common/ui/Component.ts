export abstract class Component {
	/**
	 * The component identifier (multiple instances of the same component carry the same identifier!)
	 */
	protected readonly _identifier: string;

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

		this._parent?.appendChild(this);
	}

	/**
	 * Build function that creates html elements
	 */
	public abstract build(): HTMLElement;

	/**
	 * Set the parent
	 *
	 * @param parent The Parent
	 */
	public setParent(parent: Component): void {
		this._parent = parent;
		parent.appendChild(this);
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

	/**
	 * Add child components
	 *
	 * @param args The components to add
	 */
	public appendChild(...args: Component[]): void {
		this._children.push(...args);
	}

	/**
	 * Prepend child components
	 *
	 * @param args The components to add
	 */
	public prependChild(...args: Component[]): void {
		this._children.unshift(...args);
	}

	/**
	 * Clears the children array
	 */
	public clearChildren(): void {
		this._children = [];
	}

	/**
	 * Inserts components after a specific child component
	 *
	 * @param referenceNode The child after which the new components should be inserted
	 * @param components The components to insert
	 */
	public insertAfter(referenceNode: Component, ...components: Component[]): void {
		let index = this._children.findIndex(component => component._identifier === referenceNode._identifier);

		this._children.splice(index + 1, 0, ...components);
	}

	/**
	 * Inserts components before a specific child component
	 *
	 * @param referenceNode The child before which the new components should be inserted
	 * @param components The components to insert
	 */
	public insertBefore(referenceNode: Component, ...components: Component[]): void {
		let index = this._children.findIndex(component => component._identifier === referenceNode._identifier) + 1;

		this._children.splice(index - components.length, 0, ...components);
	}
}
