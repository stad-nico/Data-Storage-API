import { SVGIcon, SVGIconOptions } from "common/ui/components/SVGIcon";

export abstract class DownloadIcon extends SVGIcon {
	public static readonly identifier: string = "DownloadIcon";

	constructor(options: SVGIconOptions, width: number, height: number) {
		super(
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
