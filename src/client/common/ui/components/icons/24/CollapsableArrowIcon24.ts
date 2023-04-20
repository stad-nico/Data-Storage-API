import { Component } from "common/ui/Component";
import { CollapsableArrowIcon } from "common/ui/components/icons/CollapsableArrowIcon";

export class CollapsableArrowIcon24 extends CollapsableArrowIcon {
	public static readonly identifier: string = "24";

	constructor(parent?: Component) {
		super(
			{
				identifier: CollapsableArrowIcon24.identifier,
				classes: [CollapsableArrowIcon24.identifier],
				parent: parent,
				dpath: "M12 14.95q-.2 0-.375-.063-.175-.062-.325-.212L6.675 10.05q-.275-.275-.262-.688.012-.412.287-.687.275-.275.7-.275.425 0 .7.275l3.9 3.9 3.925-3.925q.275-.275.688-.263.412.013.687.288.275.275.275.7 0 .425-.275.7l-4.6 4.6q-.15.15-.325.212-.175.063-.375.063Z",
			},
			24,
			24
		);
	}
}
