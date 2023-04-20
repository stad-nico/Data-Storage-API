import { DirectoryContentsCollection } from "common/ui/components/directoryContentsCollection/DirectoryContentsCollection";
import { DOMComponent } from "common/ui/components/DOM";
import { SideBySide } from "common/ui/components/SideBySide";

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

export const LayoutMap = {
	[Layout.Floating]: [{ component: SideBySide }],
};
