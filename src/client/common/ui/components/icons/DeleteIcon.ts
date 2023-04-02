import { SVGIcon, SVGIconOptions } from "../SVGIcon.js";

export abstract class DeleteIcon extends SVGIcon {
	public static readonly identifier: string = "DeleteIcon";

	constructor(options: SVGIconOptions, width: number, height: number) {
		super(
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
