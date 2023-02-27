import { PartIdentifier, PartConfiguration } from "./Part.js";

export type LayoutConfiguration = {
	[key in PartIdentifier]: PartConfiguration;
};
