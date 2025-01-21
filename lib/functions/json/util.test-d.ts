import { json, jsonb, pgTable } from "drizzle-orm/pg-core"
import { assertType, describe, expectTypeOf, it } from "vitest"
import type { BinaryJsonColumn, JsonColumn, TextJsonColumn } from "./util"

type TestDataType = { test: string }

describe("TextJsonColumn", () => {
	it("should allow a JSON column", () => {
		const tests = pgTable("tests", { json: json("json") })

		assertType<TextJsonColumn<unknown>>(tests.json)
	})

	it("should not allow a JSONB column", () => {
		const tests = pgTable("tests", { jsonb: jsonb("jsonb") })

		// @ts-expect-error JSONB column should not be allowed
		assertType<TextJsonColumn<unknown>>(tests.jsonb)
	})

	it("should match the defined type", () => {
		const tests = pgTable("tests", {
			json: json("json").$type<TestDataType>(),
		})

		expectTypeOf(tests.json).toMatchTypeOf<TextJsonColumn<TestDataType>>()
	})
})

describe("BinaryJsonColumn", () => {
	it("should allow a JSONB column", () => {
		const tests = pgTable("tests", { jsonb: jsonb("jsonb") })

		assertType<BinaryJsonColumn<unknown>>(tests.jsonb)
	})

	it("should not allow a JSON column", () => {
		const tests = pgTable("tests", { json: json("json") })

		// @ts-expect-error JSON column should not be allowed
		assertType<BinaryJsonColumn<unknown>>(tests.json)
	})

	it("should match the defined type", () => {
		const tests = pgTable("tests", {
			jsonb: jsonb("jsonb").$type<TestDataType>(),
		})

		expectTypeOf(tests.jsonb).toMatchTypeOf<BinaryJsonColumn<TestDataType>>()
	})
})

describe("JsonColumn", () => {
	it("should allow a JSON column", () => {
		const tests = pgTable("tests", { json: json("json") })

		assertType<JsonColumn<unknown>>(tests.json)
	})

	it("should allow a JSONB column", () => {
		const tests = pgTable("tests", { jsonb: jsonb("jsonb") })

		assertType<JsonColumn<unknown>>(tests.jsonb)
	})

	it("should match the defined type for a JSON column", () => {
		const tests = pgTable("tests", {
			json: json("json").$type<TestDataType>(),
		})

		expectTypeOf(tests.json).toMatchTypeOf<JsonColumn<TestDataType>>()
	})

	it("should match the defined type for a JSONB column", () => {
		const tests = pgTable("tests", {
			jsonb: jsonb("jsonb").$type<TestDataType>(),
		})

		expectTypeOf(tests.jsonb).toMatchTypeOf<JsonColumn<TestDataType>>()
	})
})
