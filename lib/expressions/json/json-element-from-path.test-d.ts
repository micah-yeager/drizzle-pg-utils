import type { SQL } from "drizzle-orm"
import { jsonb, pgTable } from "drizzle-orm/pg-core"
import { describe, expectTypeOf, it } from "vitest"
import {
	jsonElementFromPathArray,
	jsonElementFromPathArrayAsText,
} from "./json-element-from-path"

describe("jsonElementFromPathArray", () => {
	it("should return unknown for non-typed JSON", () => {
		const tests = pgTable("tests", { json: jsonb("json") })

		expectTypeOf(jsonElementFromPathArray(tests.json, ["test"])).toEqualTypeOf<
			SQL<unknown>
		>()
	})

	it("should return the correct element type", () => {
		const tests = pgTable("tests", {
			jsonArray: jsonb("json_array").$type<["static"]>(),
			jsonObject: jsonb("json_object").$type<{ test: number }>(),
			jsonNestedObject: jsonb("json_nested_object").$type<{ nested: [0] }>(),
		})

		expectTypeOf(jsonElementFromPathArray(tests.jsonArray, [0])).toEqualTypeOf<
			SQL<"static">
		>()
		expectTypeOf(jsonElementFromPathArray(tests.jsonArray, [-1])).toEqualTypeOf<
			SQL<"static">
		>()
		expectTypeOf(
			jsonElementFromPathArray(tests.jsonObject, ["test"]),
		).toEqualTypeOf<SQL<number>>()
		expectTypeOf(
			jsonElementFromPathArray(tests.jsonNestedObject, ["nested"]),
		).toEqualTypeOf<SQL<[0]>>()
		expectTypeOf(
			jsonElementFromPathArray(tests.jsonNestedObject, ["nested", -1]),
		).toEqualTypeOf<SQL<0>>()
	})

	it("should return null if the element does not exist", () => {
		const tests = pgTable("tests", {
			jsonString: jsonb("json_string").$type<string>(),
			jsonArray: jsonb("json_array").$type<["static"]>(),
			jsonObject: jsonb("json_object").$type<{ test: number }>(),
		})

		expectTypeOf(jsonElementFromPathArray(tests.jsonString, [0])).toEqualTypeOf<
			SQL<null>
		>()
		expectTypeOf(jsonElementFromPathArray(tests.jsonArray, [1])).toEqualTypeOf<
			SQL<null>
		>()
		expectTypeOf(
			jsonElementFromPathArray(tests.jsonObject, ["missing"]),
		).toEqualTypeOf<SQL<null>>()
		expectTypeOf(
			jsonElementFromPathArray(tests.jsonObject, ["test", 0]),
		).toEqualTypeOf<SQL<null>>()
	})
})

describe("jsonElementFromPathArrayAsText", () => {
	it("should return unknown for non-typed JSON", () => {
		const tests = pgTable("tests", { json: jsonb("json") })

		expectTypeOf(
			jsonElementFromPathArrayAsText(tests.json, ["test"]),
		).toEqualTypeOf<SQL<string | null>>()
	})

	it("should return the correct element type", () => {
		const tests = pgTable("tests", {
			jsonArray: jsonb("json_array").$type<["static"]>(),
			jsonObject: jsonb("json_object").$type<{ test: number }>(),
			jsonNestedObject: jsonb("json_nested_object").$type<{ nested: [0] }>(),
		})

		expectTypeOf(
			jsonElementFromPathArrayAsText(tests.jsonArray, [0]),
		).toEqualTypeOf<SQL<"static">>()
		expectTypeOf(
			jsonElementFromPathArrayAsText(tests.jsonArray, [-1]),
		).toEqualTypeOf<SQL<"static">>()
		expectTypeOf(
			jsonElementFromPathArrayAsText(tests.jsonObject, ["test"]),
		).toEqualTypeOf<SQL<string>>()
		expectTypeOf(
			jsonElementFromPathArrayAsText(tests.jsonNestedObject, ["nested"]),
		).toEqualTypeOf<SQL<string>>()
		expectTypeOf(
			jsonElementFromPathArrayAsText(tests.jsonNestedObject, ["nested", -1]),
		).toEqualTypeOf<SQL<"0">>()
	})

	it("should return null if the element does not exist", () => {
		const tests = pgTable("tests", {
			jsonString: jsonb("json_string").$type<string>(),
			jsonArray: jsonb("json_array").$type<["static"]>(),
			jsonObject: jsonb("json_object").$type<{ test: number }>(),
		})

		expectTypeOf(
			jsonElementFromPathArrayAsText(tests.jsonString, [0]),
		).toEqualTypeOf<SQL<null>>()
		expectTypeOf(
			jsonElementFromPathArrayAsText(tests.jsonArray, [1]),
		).toEqualTypeOf<SQL<null>>()
		expectTypeOf(
			jsonElementFromPathArrayAsText(tests.jsonObject, ["missing"]),
		).toEqualTypeOf<SQL<null>>()
		expectTypeOf(
			jsonElementFromPathArrayAsText(tests.jsonObject, ["test", 0]),
		).toEqualTypeOf<SQL<null>>()
	})
})
