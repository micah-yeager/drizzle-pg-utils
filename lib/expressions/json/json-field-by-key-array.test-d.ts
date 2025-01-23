import type { SQL } from "drizzle-orm"
import { jsonb, pgTable } from "drizzle-orm/pg-core"
import { describe, expectTypeOf, it } from "vitest"
import {
	jsonFieldByKeyArray,
	jsonFieldByKeyArrayAsText,
} from "./json-field-by-key-array"

describe("jsonFieldByKeyArray", () => {
	it("should return unknown for non-typed JSON", () => {
		const tests = pgTable("tests", { json: jsonb("json") })

		expectTypeOf(jsonFieldByKeyArray(tests.json, ["test"])).toEqualTypeOf<
			SQL<unknown>
		>()
	})

	it("should return the correct element type", () => {
		const tests = pgTable("tests", {
			jsonArray: jsonb("json_array").$type<["static"]>(),
			jsonObject: jsonb("json_object").$type<{ test: number }>(),
			jsonNestedObject: jsonb("json_nested_object").$type<{ nested: [0] }>(),
		})

		expectTypeOf(jsonFieldByKeyArray(tests.jsonArray, [0])).toEqualTypeOf<
			SQL<"static">
		>()
		expectTypeOf(jsonFieldByKeyArray(tests.jsonArray, [-1])).toEqualTypeOf<
			SQL<"static">
		>()
		expectTypeOf(jsonFieldByKeyArray(tests.jsonObject, ["test"])).toEqualTypeOf<
			SQL<number>
		>()
		expectTypeOf(
			jsonFieldByKeyArray(tests.jsonNestedObject, ["nested"]),
		).toEqualTypeOf<SQL<[0]>>()
		expectTypeOf(
			jsonFieldByKeyArray(tests.jsonNestedObject, ["nested", -1]),
		).toEqualTypeOf<SQL<0>>()
	})

	it("should return null if the element does not exist", () => {
		const tests = pgTable("tests", {
			jsonString: jsonb("json_string").$type<string>(),
			jsonArray: jsonb("json_array").$type<["static"]>(),
			jsonObject: jsonb("json_object").$type<{ test: number }>(),
		})

		expectTypeOf(jsonFieldByKeyArray(tests.jsonString, [0])).toEqualTypeOf<
			SQL<null>
		>()
		expectTypeOf(jsonFieldByKeyArray(tests.jsonArray, [1])).toEqualTypeOf<
			SQL<null>
		>()
		expectTypeOf(
			jsonFieldByKeyArray(tests.jsonObject, ["missing"]),
		).toEqualTypeOf<SQL<null>>()
		expectTypeOf(
			jsonFieldByKeyArray(tests.jsonObject, ["test", 0]),
		).toEqualTypeOf<SQL<null>>()
	})
})

describe("jsonFieldByKeyArrayAsText", () => {
	it("should return unknown for non-typed JSON", () => {
		const tests = pgTable("tests", { json: jsonb("json") })

		expectTypeOf(jsonFieldByKeyArrayAsText(tests.json, ["test"])).toEqualTypeOf<
			SQL<string | null>
		>()
	})

	it("should return the correct element type", () => {
		const tests = pgTable("tests", {
			jsonArray: jsonb("json_array").$type<["static"]>(),
			jsonObject: jsonb("json_object").$type<{ test: number }>(),
			jsonNestedObject: jsonb("json_nested_object").$type<{ nested: [0] }>(),
		})

		expectTypeOf(jsonFieldByKeyArrayAsText(tests.jsonArray, [0])).toEqualTypeOf<
			SQL<"static">
		>()
		expectTypeOf(
			jsonFieldByKeyArrayAsText(tests.jsonArray, [-1]),
		).toEqualTypeOf<SQL<"static">>()
		expectTypeOf(
			jsonFieldByKeyArrayAsText(tests.jsonObject, ["test"]),
		).toEqualTypeOf<SQL<string>>()
		expectTypeOf(
			jsonFieldByKeyArrayAsText(tests.jsonNestedObject, ["nested"]),
		).toEqualTypeOf<SQL<string>>()
		expectTypeOf(
			jsonFieldByKeyArrayAsText(tests.jsonNestedObject, ["nested", -1]),
		).toEqualTypeOf<SQL<"0">>()
	})

	it("should return null if the element does not exist", () => {
		const tests = pgTable("tests", {
			jsonString: jsonb("json_string").$type<string>(),
			jsonArray: jsonb("json_array").$type<["static"]>(),
			jsonObject: jsonb("json_object").$type<{ test: number }>(),
		})

		expectTypeOf(
			jsonFieldByKeyArrayAsText(tests.jsonString, [0]),
		).toEqualTypeOf<SQL<null>>()
		expectTypeOf(jsonFieldByKeyArrayAsText(tests.jsonArray, [1])).toEqualTypeOf<
			SQL<null>
		>()
		expectTypeOf(
			jsonFieldByKeyArrayAsText(tests.jsonObject, ["missing"]),
		).toEqualTypeOf<SQL<null>>()
		expectTypeOf(
			jsonFieldByKeyArrayAsText(tests.jsonObject, ["test", 0]),
		).toEqualTypeOf<SQL<null>>()
	})
})
