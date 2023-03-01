import { Service, IService } from "src/client/common/services/Service.js";
import { Layout } from "src/client/common/ui/Layout.js";
import { DOMComponent } from "src/client/common/ui/components/DOMComponent.js";

export interface IUserInterfaceService extends IService {}

export class UserInterfaceService extends Service implements IUserInterfaceService {
	/**
	 * Layout
	 */
	private _layout: Layout;

	/**
	 * DOMComponent that handles UI Component creation
	 */
	private readonly _domComponent: DOMComponent;

	/**
	 * Creates a new UserInterfaceService instance
	 *
	 * @param layout The layout
	 */
	constructor(layout: Layout) {
		super();

		this._layout = layout;

		this._domComponent = new DOMComponent(document.body);
	}

	/**
	 * Set the layout
	 *
	 * @param layout The new layout
	 */
	public setLayout(layout: Layout): void {
		this._layout = layout;
	}

	/**
	 * Get the current layout
	 */
	public getLayout(): Layout {
		return this._layout;
	}
}
