import type { SQL } from "drizzle-orm"
import { jsonb, pgTable } from "drizzle-orm/pg-core"
import { describe, expectTypeOf, it } from "vitest"
import { jsonFieldByKey, jsonFieldByKeyAsText } from "./json-field-by-key"

describe("jsonFieldByKey", () => {
	it("should return unknown for non-typed JSON", () => {
		const tests = pgTable("tests", { json: jsonb("json") })

		expectTypeOf(jsonFieldByKey(tests.json, "test")).toEqualTypeOf<
			SQL<unknown>
		>()
	})

	it("should return the correct element type", () => {
		const tests = pgTable("tests", {
			jsonArray: jsonb("json_array").$type<["static"]>(),
			jsonObject: jsonb("json_object").$type<{ test: number }>(),
			jsonNestedObject: jsonb("json_nested_object").$type<{ nested: [0] }>(),
		})

		expectTypeOf(jsonFieldByKey(tests.jsonArray, 0)).toEqualTypeOf<
			SQL<"static">
		>()
		expectTypeOf(jsonFieldByKey(tests.jsonArray, -1)).toEqualTypeOf<
			SQL<"static">
		>()
		expectTypeOf(jsonFieldByKey(tests.jsonObject, "test")).toEqualTypeOf<
			SQL<number>
		>()
		expectTypeOf(
			jsonFieldByKey(tests.jsonNestedObject, "nested"),
		).toEqualTypeOf<SQL<[0]>>()
	})

	it("should return null if the element does not exist", () => {
		const tests = pgTable("tests", {
			jsonString: jsonb("json_string").$type<string>(),
			jsonArray: jsonb("json_array").$type<["static"]>(),
			jsonObject: jsonb("json_object").$type<{ test: number }>(),
		})

		expectTypeOf(jsonFieldByKey(tests.jsonString, 0)).toEqualTypeOf<SQL<null>>()
		expectTypeOf(jsonFieldByKey(tests.jsonArray, 1)).toEqualTypeOf<SQL<null>>()
		expectTypeOf(jsonFieldByKey(tests.jsonObject, "missing")).toEqualTypeOf<
			SQL<null>
		>()
	})
})

describe("jsonFieldByKeyAsText", () => {
	it("should return unknown for non-typed JSON", () => {
		const tests = pgTable("tests", { json: jsonb("json") })

		expectTypeOf(jsonFieldByKeyAsText(tests.json, "test")).toEqualTypeOf<
			SQL<string | null>
		>()
	})

	it("should return the correct element type", () => {
		const tests = pgTable("tests", {
			jsonArray: jsonb("json_array").$type<["static"]>(),
			jsonObject: jsonb("json_object").$type<{ test: number }>(),
			jsonNestedObject: jsonb("json_nested_object").$type<{ nested: [0] }>(),
		})

		expectTypeOf(jsonFieldByKeyAsText(tests.jsonArray, 0)).toEqualTypeOf<
			SQL<"static">
		>()
		expectTypeOf(jsonFieldByKeyAsText(tests.jsonArray, -1)).toEqualTypeOf<
			SQL<"static">
		>()
		expectTypeOf(jsonFieldByKeyAsText(tests.jsonObject, "test")).toEqualTypeOf<
			SQL<string>
		>()
		expectTypeOf(
			jsonFieldByKeyAsText(tests.jsonNestedObject, "nested"),
		).toEqualTypeOf<SQL<string>>()
	})

	it("should return null if the element does not exist", () => {
		const tests = pgTable("tests", {
			jsonString: jsonb("json_string").$type<string>(),
			jsonArray: jsonb("json_array").$type<["static"]>(),
			jsonObject: jsonb("json_object").$type<{ test: number }>(),
		})

		expectTypeOf(jsonFieldByKeyAsText(tests.jsonString, 0)).toEqualTypeOf<
			SQL<null>
		>()
		expectTypeOf(jsonFieldByKeyAsText(tests.jsonArray, 1)).toEqualTypeOf<
			SQL<null>
		>()
		expectTypeOf(
			jsonFieldByKeyAsText(tests.jsonObject, "missing"),
		).toEqualTypeOf<SQL<null>>()
	})
})
