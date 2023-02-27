export abstract class Part<T extends PartIdentifier> implements IPart {
	public readonly id: T;

	protected constructor(id: T) {
		this.id = id;
	}

	public abstract create<T extends PartIdentifier>(parent: Part<T>, options?: object): void;
}

export interface IPart {
	readonly id: PartIdentifier;
	create<T extends PartIdentifier>(parent: Part<T>, options?: object): void;
}

export enum PartIdentifier {}

export interface PartPosition {
	type: "relative" | "absolute";
	top?: number | string | undefined;
	left?: number | string | undefined;
	right?: number | string | undefined;
	bottom?: number | string | undefined;
}

export interface PartConfiguration {
	id: PartIdentifier;
	position: PartPosition;
	classes: string[];
}

/**
 *
 * @param {PartIdentifier} type - The part identifier
 * @returns Stuff
 */
export function createPart<T extends PartIdentifier>(type: { new (): Part<T> }): Part<T> {
	return new type();
}
