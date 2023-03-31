import { HTMLElementComponent } from "../../HTMLElementComponent.js";

export class ContextMenu extends HTMLElementComponent<"main"> {
	public static readonly identifier: string = "ContextMenu";

	constructor() {
		super("main", {});
	}
}
