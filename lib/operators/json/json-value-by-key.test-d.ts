import { type SQL, sql } from "drizzle-orm"
import { jsonb, pgTable } from "drizzle-orm/pg-core"
import { describe, expectTypeOf, it } from "vitest"
import { jsonFieldByKeyAsText, jsonValueByKey } from "./json-value-by-key"

describe("jsonValueByKey", () => {
	it("should allow overriding the return type", () => {
		expectTypeOf(jsonValueByKey<number>(sql``, "test")).toEqualTypeOf<
			SQL<number>
		>()
	})

	it("should return unknown for non-typed JSON", () => {
		const tests = pgTable("tests", { json: jsonb("json") })

		expectTypeOf(jsonValueByKey(tests.json, "test")).toEqualTypeOf<
			SQL<unknown>
		>()
	})

	it("should return the correct element type", () => {
		const tests = pgTable("tests", {
			jsonArray: jsonb("json_array").$type<["static"]>(),
			jsonObject: jsonb("json_object").$type<{ test: number }>(),
			jsonNestedObject: jsonb("json_nested_object").$type<{ nested: [0] }>(),
		})

		expectTypeOf(jsonValueByKey(tests.jsonArray, 0)).toEqualTypeOf<
			SQL<"static">
		>()
		expectTypeOf(jsonValueByKey(tests.jsonArray, -1)).toEqualTypeOf<
			SQL<"static">
		>()
		expectTypeOf(jsonValueByKey(tests.jsonObject, "test")).toEqualTypeOf<
			SQL<number>
		>()
		expectTypeOf(
			jsonValueByKey(tests.jsonNestedObject, "nested"),
		).toEqualTypeOf<SQL<[0]>>()
	})

	it("should return null if the element does not exist", () => {
		const tests = pgTable("tests", {
			jsonString: jsonb("json_string").$type<string>(),
			jsonArray: jsonb("json_array").$type<["static"]>(),
			jsonObject: jsonb("json_object").$type<{ test: number }>(),
		})

		expectTypeOf(jsonValueByKey(tests.jsonString, 0)).toEqualTypeOf<SQL<null>>()
		expectTypeOf(jsonValueByKey(tests.jsonArray, 1)).toEqualTypeOf<SQL<null>>()
		expectTypeOf(jsonValueByKey(tests.jsonObject, "missing")).toEqualTypeOf<
			SQL<null>
		>()
	})
})

describe("jsonFieldByKeyAsText", () => {
	it("should allow overriding the return type", () => {
		expectTypeOf(jsonFieldByKeyAsText<string>(sql``, "test")).toEqualTypeOf<
			SQL<string>
		>()
	})

	it("should disallow non-string return type overrides", () => {
		// @ts-expect-error: `number` does not extend `string`.
		expectTypeOf(jsonFieldByKeyAsText<number>(sql``, [])).toEqualTypeOf<
			SQL<number>
		>()
	})

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
