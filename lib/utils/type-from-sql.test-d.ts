// noinspection JSUnusedLocalSymbols

import type { SQL } from "drizzle-orm"
import { integer, json, jsonb, pgTable, text } from "drizzle-orm/pg-core"
import { describe, expectTypeOf, it } from "vitest"
import { type CircleTuple, circle } from "../columns/circle"
import { money } from "../columns/money"
import type { TypeFromSQL } from "./type-from-sql"

type JsonType = { test: string; nested: { key: "value" } }

describe("column builder", () => {
	it("should parse built-in type", () => {
		const builder = integer()

		expectTypeOf<TypeFromSQL<typeof builder>>().toEqualTypeOf<number | null>()
	})

	it("should parse custom type from `customType()`", () => {
		const builder = money()

		expectTypeOf<TypeFromSQL<typeof builder>>().toEqualTypeOf<string | null>()
	})

	it("should parse custom type from `PgColumnBuilder`", () => {
		const builder = circle()

		expectTypeOf<
			TypeFromSQL<typeof builder>
		>().toEqualTypeOf<CircleTuple | null>()
	})

	it("should parse when using `.notNull()`", () => {
		const builder = circle().notNull()

		expectTypeOf<TypeFromSQL<typeof builder>>().toEqualTypeOf<CircleTuple>()
	})

	it("should parse when using `.array()`", () => {
		const builder = circle().array()

		expectTypeOf<TypeFromSQL<typeof builder>>().toEqualTypeOf<
			CircleTuple[] | null
		>()
	})

	it("should parse when using `.$type()`", () => {
		const builder = jsonb().$type<JsonType>()

		expectTypeOf<TypeFromSQL<typeof builder>>().toEqualTypeOf<JsonType | null>()
	})

	it("should prefer `.$type()` over built-in type", () => {
		const builder = text().$type<number>()

		expectTypeOf<TypeFromSQL<typeof builder>>().toEqualTypeOf<number | null>()
	})

	it("should allow unknown types", () => {
		const builder = jsonb()

		expectTypeOf<TypeFromSQL<typeof builder>>().toEqualTypeOf<unknown>()
	})
})

describe("table column", () => {
	// biome-ignore lint/correctness/noUnusedVariables: Only used for type info.
	const table = pgTable("", {
		builtIn: integer(),
		customType: money(),
		columnBuilder: circle(),
		array: integer().array(),
		typed: json().$type<JsonType>(),
		enum: text({ enum: ["enum1", "enum2"] }).array(),
	})

	it("should parse built-in type", () => {
		const table = pgTable("", { col: integer() })

		expectTypeOf<TypeFromSQL<typeof table.col>>().toEqualTypeOf<number | null>()
	})

	it("should parse custom type from `customType()`", () => {
		const table = pgTable("", { col: money() })

		expectTypeOf<TypeFromSQL<typeof table.col>>().toEqualTypeOf<string | null>()
	})

	it("should parse custom type from `PgColumnBuilder`", () => {
		const table = pgTable("", { col: circle() })

		expectTypeOf<
			TypeFromSQL<typeof table.col>
		>().toEqualTypeOf<CircleTuple | null>()
	})

	it("should parse when using `.notNull()`", () => {
		const table = pgTable("", { col: circle().notNull() })

		expectTypeOf<TypeFromSQL<typeof table.col>>().toEqualTypeOf<CircleTuple>()
	})

	it("should parse when using `.array()`", () => {
		const table = pgTable("", { col: circle().array() })

		expectTypeOf<TypeFromSQL<typeof table.col>>().toEqualTypeOf<
			CircleTuple[] | null
		>()
	})

	it("should parse when using `.$type()`", () => {
		const table = pgTable("", { col: jsonb().$type<JsonType>() })

		expectTypeOf<
			TypeFromSQL<typeof table.col>
		>().toEqualTypeOf<JsonType | null>()
	})

	it("should prefer `.$type()` over built-in type", () => {
		const table = pgTable("", { col: text().$type<"test">() })

		expectTypeOf<TypeFromSQL<typeof table.col>>().toEqualTypeOf<"test" | null>()
	})

	it("should allow unknown types", () => {
		const table = pgTable("", { col: jsonb() })

		expectTypeOf<TypeFromSQL<typeof table.col>>().toEqualTypeOf<unknown>()
	})
})

describe("SQL", () => {
	it("should parse when untyped", () => {
		expectTypeOf<TypeFromSQL<SQL>>().toEqualTypeOf<unknown>()
	})

	it("should parse when typed", () => {
		expectTypeOf<TypeFromSQL<SQL<JsonType>>>().toEqualTypeOf<JsonType>()
	})
})
