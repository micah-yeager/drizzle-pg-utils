import { type SQL, sql } from "drizzle-orm"
import { integer, json, pgTable, text } from "drizzle-orm/pg-core"
import { describe, expectTypeOf, it } from "vitest"
import { type CircleTuple, circle } from "../columns/circle"
import { money } from "../columns/money"
import { cast } from "./cast"

type TestJson = { test: string; nested: { test: number }; literal: "literal" }

it("should return as unknown if using string to cast", () => {
	expectTypeOf(cast(sql``, "text")).toEqualTypeOf<SQL<unknown>>()
})

it("should return as type if using column builder", () => {
	expectTypeOf(cast(sql``, integer())).toEqualTypeOf<SQL<number>>()
})

it("should return as type if using table column", () => {
	const table = pgTable("", { col: integer() })

	expectTypeOf(cast(sql``, table.col)).toEqualTypeOf<SQL<number>>()
})

describe("column builder function", () => {
	it("should return correctly for built-in type", () => {
		expectTypeOf(cast(sql``, integer)).toEqualTypeOf<SQL<number>>()
	})

	it("should return correctly for custom type from `customType()`", () => {
		expectTypeOf(cast(sql``, money)).toEqualTypeOf<SQL<string>>()
	})

	it("should return correctly for custom type from `PgColumnBuilder`", () => {
		expectTypeOf(cast(sql``, circle)).toEqualTypeOf<SQL<CircleTuple>>()
	})
})

describe("return type override", () => {
	it("should return correctly for unknown types", () => {
		expectTypeOf(cast<TestJson>(sql``, json)).toEqualTypeOf<SQL<TestJson>>()
	})

	it("should return correctly for inferred types", () => {
		expectTypeOf(cast<number>(sql``, text)).toEqualTypeOf<SQL<number>>()
	})
})
