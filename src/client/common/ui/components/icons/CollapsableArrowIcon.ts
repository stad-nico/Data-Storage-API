import { EventEmitter } from "common/EventEmitter";
import { SVGIcon, SVGIconOptions } from "common/ui/components/SVGIcon";
import { APIBridge } from "src/APIBridge";

export abstract class CollapsableArrowIcon extends SVGIcon {
	public static readonly identifier: string = "CollapsableArrow";

	constructor(apiBridge: APIBridge, eventEmitter: EventEmitter, options: SVGIconOptions, width: number, height: number) {
		super(
			apiBridge,
			eventEmitter,
			{
				identifier: options?.identifier || CollapsableArrowIcon.identifier,
				classes: options?.classes ? options.classes.concat([CollapsableArrowIcon.identifier]) : [CollapsableArrowIcon.identifier],
				parent: options?.parent,
				dpath: options.dpath,
			},
			width,
			height
		);
	}
}
