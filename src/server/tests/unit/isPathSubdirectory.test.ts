import { isPathSubdirectory } from "../../src/isPathSubdirectory";
import { describe, expect, test } from "@jest/globals";

describe("isPathSubdirectory module", () => {
	test("valid subpath should return true", () => {
		expect(isPathSubdirectory("test", "test/path")).toBe(true);
	});

	test("invalid subpath with parent directory selectors should return false", () => {
		expect(isPathSubdirectory("test", "test/path/../../../")).toBe(false);
	});

	test("absolute parent path with a valid relative subpath should return true", () => {
		expect(isPathSubdirectory("C:/test/", "./test")).toBe(true);
	});

	test("absolute parent path with an invalid relative subpath with parent directory selectors should return false", () => {
		expect(isPathSubdirectory("C:/test", "./test/../../")).toBe(false);
	});

	test("same path should return false", () => {
		expect(isPathSubdirectory("C:/test/", "C:/test/")).toBe(false);
	});

	test("two valid absolute paths should return true", () => {
		expect(isPathSubdirectory("C:/test/", "C:/test/test2/")).toBe(true);
	});
});
