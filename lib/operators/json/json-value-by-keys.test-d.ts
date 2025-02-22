import { type SQL, sql } from "drizzle-orm"
import { jsonb, pgTable } from "drizzle-orm/pg-core"
import { describe, expectTypeOf, it } from "vitest"
import { jsonFieldByKeysAsText, jsonValueByKeys } from "./json-value-by-keys"

describe("jsonValueByKeys", () => {
	it("should allow overriding the return type", () => {
		expectTypeOf(jsonValueByKeys<number>(sql``, [])).toEqualTypeOf<
			SQL<number>
		>()
	})

	it("should return unknown for non-typed JSON", () => {
		const tests = pgTable("tests", { json: jsonb("json") })

		expectTypeOf(jsonValueByKeys(tests.json, ["test"])).toEqualTypeOf<
			SQL<unknown>
		>()
	})

	it("should return the correct element type", () => {
		const tests = pgTable("tests", {
			jsonArray: jsonb("json_array").$type<["static"]>(),
			jsonObject: jsonb("json_object").$type<{ test: number }>(),
			jsonNestedObject: jsonb("json_nested_object").$type<{ nested: [0] }>(),
		})

		expectTypeOf(jsonValueByKeys(tests.jsonArray, [0])).toEqualTypeOf<
			SQL<"static">
		>()
		expectTypeOf(jsonValueByKeys(tests.jsonArray, [-1])).toEqualTypeOf<
			SQL<"static">
		>()
		expectTypeOf(jsonValueByKeys(tests.jsonObject, ["test"])).toEqualTypeOf<
			SQL<number>
		>()
		expectTypeOf(
			jsonValueByKeys(tests.jsonNestedObject, ["nested"]),
		).toEqualTypeOf<SQL<[0]>>()
		expectTypeOf(
			jsonValueByKeys(tests.jsonNestedObject, ["nested", -1]),
		).toEqualTypeOf<SQL<0>>()
	})

	it("should return null if the element does not exist", () => {
		const tests = pgTable("tests", {
			jsonString: jsonb("json_string").$type<string>(),
			jsonArray: jsonb("json_array").$type<["static"]>(),
			jsonObject: jsonb("json_object").$type<{ test: number }>(),
		})

		expectTypeOf(jsonValueByKeys(tests.jsonString, [0])).toEqualTypeOf<
			SQL<null>
		>()
		expectTypeOf(jsonValueByKeys(tests.jsonArray, [1])).toEqualTypeOf<
			SQL<null>
		>()
		expectTypeOf(jsonValueByKeys(tests.jsonObject, ["missing"])).toEqualTypeOf<
			SQL<null>
		>()
		expectTypeOf(jsonValueByKeys(tests.jsonObject, ["test", 0])).toEqualTypeOf<
			SQL<null>
		>()
	})
})

describe("jsonFieldByKeysAsText", () => {
	it("should allow overriding the return type", () => {
		expectTypeOf(jsonFieldByKeysAsText<string>(sql``, [])).toEqualTypeOf<
			SQL<string>
		>()
	})

	it("should disallow non-string return type overrides", () => {
		// @ts-expect-error: `number` does not extend `string`.
		expectTypeOf(jsonFieldByKeysAsText<number>(sql``, [])).toEqualTypeOf<
			SQL<number>
		>()
	})

	it("should return unknown for non-typed JSON", () => {
		const tests = pgTable("tests", { json: jsonb("json") })

		expectTypeOf(jsonFieldByKeysAsText(tests.json, ["test"])).toEqualTypeOf<
			SQL<string | null>
		>()
	})

	it("should return the correct element type", () => {
		const tests = pgTable("tests", {
			jsonArray: jsonb("json_array").$type<["static"]>(),
			jsonObject: jsonb("json_object").$type<{ test: number }>(),
			jsonNestedObject: jsonb("json_nested_object").$type<{ nested: [0] }>(),
		})

		expectTypeOf(jsonFieldByKeysAsText(tests.jsonArray, [0])).toEqualTypeOf<
			SQL<"static">
		>()
		expectTypeOf(jsonFieldByKeysAsText(tests.jsonArray, [-1])).toEqualTypeOf<
			SQL<"static">
		>()
		expectTypeOf(
			jsonFieldByKeysAsText(tests.jsonObject, ["test"]),
		).toEqualTypeOf<SQL<string>>()
		expectTypeOf(
			jsonFieldByKeysAsText(tests.jsonNestedObject, ["nested"]),
		).toEqualTypeOf<SQL<string>>()
		expectTypeOf(
			jsonFieldByKeysAsText(tests.jsonNestedObject, ["nested", -1]),
		).toEqualTypeOf<SQL<"0">>()
	})

	it("should return null if the element does not exist", () => {
		const tests = pgTable("tests", {
			jsonString: jsonb("json_string").$type<string>(),
			jsonArray: jsonb("json_array").$type<["static"]>(),
			jsonObject: jsonb("json_object").$type<{ test: number }>(),
		})

		expectTypeOf(jsonFieldByKeysAsText(tests.jsonString, [0])).toEqualTypeOf<
			SQL<null>
		>()
		expectTypeOf(jsonFieldByKeysAsText(tests.jsonArray, [1])).toEqualTypeOf<
			SQL<null>
		>()
		expectTypeOf(
			jsonFieldByKeysAsText(tests.jsonObject, ["missing"]),
		).toEqualTypeOf<SQL<null>>()
		expectTypeOf(
			jsonFieldByKeysAsText(tests.jsonObject, ["test", 0]),
		).toEqualTypeOf<SQL<null>>()
	})
})
