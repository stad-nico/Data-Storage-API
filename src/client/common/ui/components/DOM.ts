import { API } from "src/API";
import { HTMLElementComponent } from "common/ui/components/HTMLElementComponent";
import { BackendToFrontendEvent, FrontendToBackendEvent } from "src/APIEvents";
import { EventEmitter } from "common/EventEmitter";
import { APIBridge } from "src/APIBridge";

export class DOMComponent extends HTMLElementComponent<"main"> {
	/**
	 * The identifier that maps to this class
	 */
	public static readonly identifier: string = "DOMComponent";

	/**
	 * The document body element all components will be injected into
	 */
	private readonly _documentBodyElement: HTMLElement;

	/**
	 * The EventEmitter that handles communication with backend and ui components
	 */
	private readonly _eventEmitter: EventEmitter;

	/**
	 * Creates a new DOMComponent
	 */
	constructor(api: APIBridge, eventEmitter: EventEmitter, classes?: string[]) {
		super("main", {
			identifier: DOMComponent.identifier,
			classes: classes ? classes.concat([DOMComponent.identifier]) : [DOMComponent.identifier],
			parent: undefined,
		});

		this._documentBodyElement = document.body;
		this._eventEmitter = eventEmitter;

		this._connectAPI(api);
	}

	private _connectAPI(api: APIBridge): void {
		for (let item in BackendToFrontendEvent) {
			api.on(BackendToFrontendEvent[item], data => this._eventEmitter.fire(FrontendToBackendEvent[item], data));
		}

		for (let item in FrontendToBackendEvent) {
			this._eventEmitter.on(FrontendToBackendEvent[item], data => api.fire(FrontendToBackendEvent[item], data));
		}
	}

	public override build(): HTMLElement {
		let buildElement = super.build();
		this._documentBodyElement.append(buildElement);
		return buildElement;
	}
}
