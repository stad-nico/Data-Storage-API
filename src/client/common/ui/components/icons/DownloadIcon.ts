import { EventEmitter } from "common/EventEmitter";
import { SVGIcon, SVGIconOptions } from "common/ui/components/SVGIcon";
import { APIBridge } from "src/APIBridge";

export abstract class DownloadIcon extends SVGIcon {
	public static readonly identifier: string = "DownloadIcon";

	constructor(apiBridge: APIBridge, eventEmitter: EventEmitter, options: SVGIconOptions, width: number, height: number) {
		super(
			apiBridge,
			eventEmitter,
			{
				identifier: options?.identifier || DownloadIcon.identifier,
				classes: options?.classes ? options.classes.concat([DownloadIcon.identifier]) : [DownloadIcon.identifier],
				parent: options?.parent,
				dpath: options.dpath,
			},
			width,
			height
		);
	}
}
