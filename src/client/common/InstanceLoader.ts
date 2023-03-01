// import { ComponentIdentifier, ComponentMap } from "./ui/Component.js";

// // https://stackoverflow.com/questions/62080661/typescript-how-do-i-declare-a-generic-class-factory-that-maps-enums-to-types-in

// type KindMap = typeof ComponentMap;
// type Tuples<K = ComponentIdentifier> = K extends ComponentIdentifier
// 	? [K, InstanceType<KindMap[K]>, InstanceType<typeof ComponentMap[K]> extends { create: (a: infer P) => any } ? P : never]
// 	: never;

// type ClassType<K> = Extract<Tuples, [K, any, any]>[1];
// type ParamsType<K> = Extract<Tuples, [K, any, any]>[2];

// export class InstanceLoader {
// 	public static createInstance<K extends ComponentIdentifier>(key: K, params: ParamsType<K>): ClassType<K> {
// 		const componentClass = ComponentMap[key];

// 		const componentInstance = new componentClass();

// 		componentInstance.create(params);

// 		return componentInstance;
// 	}
// }
