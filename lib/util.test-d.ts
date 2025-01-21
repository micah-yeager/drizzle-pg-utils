import type { SQL } from "drizzle-orm"
import { integer, json, pgTable, text } from "drizzle-orm/pg-core"
import { describe, expectTypeOf, it } from "vitest"
import type { TypeFromSQL } from "./util"

describe("TypeFromSQL", () => {
	describe("column", () => {
		it("should return the correct type when untyped", () => {
			// eslint-disable-next-line unused-imports/no-unused-vars
			const tests = pgTable("tests", {
				text: text("text"),
				integer: integer("integer").notNull(),
				json: json("json"),
			})

			expectTypeOf<TypeFromSQL<typeof tests.text>>().toEqualTypeOf<
				string | null
			>()
			expectTypeOf<TypeFromSQL<typeof tests.integer>>().toEqualTypeOf<number>()
			expectTypeOf<TypeFromSQL<typeof tests.json>>().toEqualTypeOf<unknown>()
		})

		it("should return the correct type when typed", () => {
			type TestString = "literal"
			type TestInteger = 0
			type TestJson = { test: string }
			// eslint-disable-next-line unused-imports/no-unused-vars
			const tests = pgTable("tests", {
				text: text("text").$type<TestString>(),
				integer: integer("integer").notNull().$type<TestInteger>(),
				json: json("json").$type<TestJson>(),
			})

			expectTypeOf<
				TypeFromSQL<typeof tests.text>
			>().toEqualTypeOf<TestString | null>()
			expectTypeOf<
				TypeFromSQL<typeof tests.integer>
			>().toEqualTypeOf<TestInteger>()
			expectTypeOf<
				TypeFromSQL<typeof tests.json>
			>().toEqualTypeOf<TestJson | null>()
		})
	})

	describe("SQL", () => {
		it("should return the correct type when untyped", () => {
			expectTypeOf<TypeFromSQL<SQL>>().toEqualTypeOf<unknown>()
		})

		it("should return the correct type when typed", () => {
			type TestString = "literal"
			type TestInteger = 0
			type TestJson = { test: string }

			expectTypeOf<TypeFromSQL<SQL<TestString>>>().toEqualTypeOf<TestString>()
			expectTypeOf<TypeFromSQL<SQL<TestInteger>>>().toEqualTypeOf<TestInteger>()
			expectTypeOf<TypeFromSQL<SQL<TestJson>>>().toEqualTypeOf<TestJson>()
		})
	})

	describe("column builder", () => {
		it("should return the correct type when untyped", () => {
			// eslint-disable-next-line unused-imports/no-unused-vars
			const textBuilder = text("text")
			// eslint-disable-next-line unused-imports/no-unused-vars
			const integerBuilder = integer("integer").notNull()
			// eslint-disable-next-line unused-imports/no-unused-vars
			const jsonBuilder = json("json")

			expectTypeOf<TypeFromSQL<typeof textBuilder>>().toEqualTypeOf<
				string | null
			>()
			expectTypeOf<TypeFromSQL<typeof integerBuilder>>().toEqualTypeOf<number>()
			expectTypeOf<TypeFromSQL<typeof jsonBuilder>>().toEqualTypeOf<unknown>()
		})
	})
})
