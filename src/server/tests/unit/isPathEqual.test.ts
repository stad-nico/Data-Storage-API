import { describe, expect, test } from "@jest/globals";
import { isAbsolutePathEqual } from "../../src/isPathEqual";

describe("isAbsolutePathEqual module", () => {
	test("two identical absolute paths should return true", () => {
		expect(isAbsolutePathEqual("C:/test", "C:/test")).toBe(true);
	});

	test("two different absolute paths should return false", () => {
		expect(isAbsolutePathEqual("C:/test", "C:/test/out")).toBe(false);
	});
});
