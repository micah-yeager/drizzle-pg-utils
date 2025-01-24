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

describe("return type override", () => {
	it("should return correctly for unknown types", () => {
		expectTypeOf(cast<TestJson>(sql``, json)).toEqualTypeOf<SQL<TestJson>>()
	})

	it("should return correctly for inferred types", () => {
		expectTypeOf(cast<number>(sql``, text)).toEqualTypeOf<SQL<number>>()
	})
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

describe("column builder", () => {
	it("should return correctly for built-in type", () => {
		expectTypeOf(cast(sql``, integer())).toEqualTypeOf<SQL<number>>()
	})

	it("should return correctly for custom type from `customType()`", () => {
		expectTypeOf(cast(sql``, money())).toEqualTypeOf<SQL<string>>()
	})

	it("should return correctly for custom type from `PgColumnBuilder`", () => {
		expectTypeOf(cast(sql``, circle())).toEqualTypeOf<SQL<CircleTuple>>()
	})

	it("should return correctly for array", () => {
		expectTypeOf(cast(sql``, integer().array())).toEqualTypeOf<SQL<number[]>>()
	})

	it("should return correctly for `$type()`", () => {
		expectTypeOf(cast(sql``, json().$type<TestJson>())).toEqualTypeOf<
			SQL<TestJson>
		>()
	})

	it("should return correctly for enum", () => {
		expectTypeOf(
			cast(sql``, text("enum", { enum: ["enum1", "enum2"] }).array()),
		).toEqualTypeOf<SQL<("enum1" | "enum2")[]>>()
	})
})

describe("table column", () => {
	const table = pgTable("", {
		builtIn: integer(),
		customType: money(),
		columnBuilder: circle(),
		array: integer().array(),
		typed: json().$type<TestJson>(),
		enum: text("enum", { enum: ["enum1", "enum2"] }).array(),
	})

	it("should return correctly for built-in type", () => {
		expectTypeOf(cast(sql``, table.builtIn)).toEqualTypeOf<SQL<number>>()
	})

	it("should return correctly for custom type from `customType()`", () => {
		expectTypeOf(cast(sql``, table.customType)).toEqualTypeOf<SQL<string>>()
	})

	it("should return correctly for custom type from `PgColumnBuilder`", () => {
		expectTypeOf(cast(sql``, table.columnBuilder)).toEqualTypeOf<
			SQL<CircleTuple>
		>()
	})

	it("should return correctly for array", () => {
		expectTypeOf(cast(sql``, table.array)).toEqualTypeOf<SQL<number[]>>()
	})

	it("should return correctly for `$type()`", () => {
		expectTypeOf(cast(sql``, table.typed)).toEqualTypeOf<SQL<TestJson>>()
	})

	it("should return correctly for enum", () => {
		expectTypeOf(cast(sql``, table.enum)).toEqualTypeOf<
			SQL<("enum1" | "enum2")[]>
		>()
	})
})
