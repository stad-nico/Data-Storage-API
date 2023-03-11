import { DirectoryContentsCollection } from "./components/directoryContentsCollection/DirectoryContentsCollection.js";
import { DirectoryTree } from "./components/directoryTree/DirectoryTree.js";
import { DOMComponent } from "./components/DOM.js";
import { SideBySide } from "./components/SideBySide.js";
export enum Layout {
	Floating,
}

export interface ComponentMap {
	DirectoryContentsCollection: DirectoryContentsCollection;
	DOMComponent: DOMComponent;
}

export function parseLayoutType(layoutType: Layout): any {
	return [];
}

// type LayoutMap = {
// 	[Key in LayoutType]: ComponentConfig[];
// };

// type ComponentConfig<T extends new (...args: any[]) => HTMLElementComponent = ComponentMap[keyof ComponentMap]> = {
// 	component: T;
// 	args: typeof this.component;
// };

export const LayoutMap = {
	[Layout.Floating]: [{ component: SideBySide }],
};

// function f<T extends keyof ComponentMap>(e: T): ComponentMap[T] {
// 	return new ComponentMap[e];
// }
