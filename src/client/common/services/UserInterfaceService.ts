import { LayoutMap, Layout } from "common/ui/Layout";
import { DOMComponent } from "common/ui/components/DOM";
import { toKebabCase } from "common/string";
import { Theme } from "common/ui/Theme";
import { EventEmitter } from "common/EventEmitter";
import { APIBridge } from "src/APIBridge";

export class UserInterfaceService {
	/**
	 * Layout
	 */
	private _layout: Layout;

	/**
	 * Theme
	 */
	private _theme: Theme;

	/**
	 * root UI component, all components are injected into this component
	 */
	private readonly _domComponent: DOMComponent;

	/**
	 * root EventEmitter that handles communication between ui components and backend
	 */
	private readonly _eventEmitter: EventEmitter;

	private readonly _apiBridge: APIBridge;

	/**
	 * Creates a new UserInterfaceService instance
	 *
	 * @param layout The layout
	 */
	constructor(layout: Layout, theme: Theme, api: APIBridge, eventEmitter: EventEmitter) {
		this._layout = layout;
		this._theme = theme;
		this._apiBridge = api;

		this._eventEmitter = eventEmitter;
		this._domComponent = new DOMComponent(api, this._eventEmitter);

		this._buildLayout();
		this._domComponent.setAttribute("data-layout", toKebabCase(Layout[layout]));
		this._domComponent.setAttribute("data-theme", toKebabCase(this._theme));
	}

	/**
	 * Parses the layout from this._layout and builds it
	 */
	private _buildLayout(): void {
		let config = LayoutMap[this._layout];

		for (let componentConfig of config) {
			new componentConfig.component(this._apiBridge, this._eventEmitter, this._domComponent);
		}

		this._domComponent.build();
	}

	/**
	 * Update the layout
	 *
	 * @param layout The new layout
	 */
	public update(layout: Layout): void {
		this._layout = layout;
		this._buildLayout();
	}

	/**
	 * Get the current layout
	 */
	public getLayout(): Layout {
		return this._layout;
	}
}
