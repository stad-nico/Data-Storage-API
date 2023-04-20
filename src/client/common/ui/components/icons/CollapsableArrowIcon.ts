import { SVGIcon, SVGIconOptions } from "common/ui/components/SVGIcon";

export abstract class CollapsableArrowIcon extends SVGIcon {
	public static readonly identifier: string = "CollapsableArrow";

	constructor(options: SVGIconOptions, width: number, height: number) {
		super(
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
