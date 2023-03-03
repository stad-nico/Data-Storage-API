import { Service, IService } from "src/client/common/services/Service.js";
import { LayoutType } from "src/client/common/ui/Layout.js";
import { DOMComponent } from "src/client/common/ui/components/DOM.js";
import { DirectoryContentsCollection } from "../ui/components/DirectoryContentsCollection.js";

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

		this._domComponent = new DOMComponent(document.body);

		let contentCollection = new DirectoryContentsCollection(this._domComponent);
		this._buildLayout();
	}

	/**
	 * Parses the layout from this._layoutType and builds it
	 */
	private _buildLayout(): void {
		// this._domComponent.clearChildren();
		// let componentConfigs: ComponentConfig[] = parseLayoutType(this._layoutType);

		// for (let componentConfig of componentConfigs) {
		// console.log(componentConfig);
		// }

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
