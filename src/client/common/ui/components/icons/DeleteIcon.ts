import { EventEmitter } from "common/EventEmitter";
import { SVGIcon, SVGIconOptions } from "common/ui/components/SVGIcon";
import { APIBridge } from "src/APIBridge";

export abstract class DeleteIcon extends SVGIcon {
	public static readonly identifier: string = "DeleteIcon";

	constructor(apiBridge: APIBridge, eventEmitter: EventEmitter, options: SVGIconOptions, width: number, height: number) {
		super(
			apiBridge,
			eventEmitter,
			{
				identifier: options?.identifier || DeleteIcon.identifier,
				classes: options?.classes ? options.classes.concat([DeleteIcon.identifier]) : [DeleteIcon.identifier],
				parent: options?.parent,
				dpath: options.dpath,
			},
			width,
			height
		);
	}
}
