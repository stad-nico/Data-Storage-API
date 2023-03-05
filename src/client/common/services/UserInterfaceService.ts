import { Service, IService } from "src/client/common/services/Service.js";
import { Layouts, LayoutType } from "src/client/common/ui/Layout.js";
import { DOMComponent } from "src/client/common/ui/components/DOM.js";

export interface IUserInterfaceService extends IService {}

export class UserInterfaceService extends Service implements IUserInterfaceService {
	/**
	 * Layout type
	 */
	private _layoutType: LayoutType;

	/**
	 * DOMComponent that handles UI Component creation
	 */
	private readonly _domComponent: DOMComponent;

	/**
	 * Creates a new UserInterfaceService instance
	 *
	 * @param layoutType The layout type
	 */
	constructor(layoutType: LayoutType) {
		super();

		this._layoutType = layoutType;

		this._domComponent = new DOMComponent(document.body, [LayoutType[this._layoutType]]);
		this._buildLayout();
	}

	/**
	 * Parses the layout from this._layoutType and builds it
	 */
	private _buildLayout(): void {
		let config = Layouts[this._layoutType];

		for (let componentConfig of config) {
			new componentConfig.component(this._domComponent);
		}

		this._domComponent.build();
	}

	/**
	 * Update the layout type
	 *
	 * @param layoutType The new layout type
	 */
	public update(layoutType: LayoutType): void {
		this._layoutType = layoutType;
		this._buildLayout();
	}

	/**
	 * Get the current layout type
	 */
	public getLayout(): LayoutType {
		return this._layoutType;
	}
}
