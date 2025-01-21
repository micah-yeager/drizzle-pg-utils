import { type SQL, sql } from "drizzle-orm"
import { integer, json, text } from "drizzle-orm/pg-core"
import { assertType, expectTypeOf, it } from "vitest"
import { cast } from "./cast"

type TestJson = { test: string; nested: { test: number }; literal: "literal" }

it("should extract type from uninitialized function builders", () => {
	assertType<SQL<string>>(cast(sql``, text))
	assertType<SQL<number>>(cast(sql``, integer))
	expectTypeOf(cast(sql``, json)).toEqualTypeOf<SQL<unknown>>()
})

it("should extract type from simple initialized function builders", () => {
	assertType<SQL<string>>(cast(sql``, text("text")))
	assertType<SQL<number>>(cast(sql``, integer("integer")))
	expectTypeOf(cast(sql``, json("json"))).toEqualTypeOf<SQL<unknown>>()
})

it("should extract type from more complex initialized function builders", () => {
	assertType<SQL<("enum1" | "enum2")[]>>(
		cast(sql``, text("enum", { enum: ["enum1", "enum2"] }).array()),
	)
	expectTypeOf(cast(sql``, json("json").$type<TestJson>())).toEqualTypeOf<
		SQL<TestJson>
	>()
})

it("should extract type from table column", () => {
	const tests = {
		text: text("text"),
		integer: integer("integer"),
		json: json("json"),
		typedJson: json("json").$type<TestJson>(),
	}

	assertType<SQL<string>>(cast(sql`1`, tests.text))
	assertType<SQL<number>>(cast(sql`1`, tests.integer))
	expectTypeOf(cast(sql`1`, tests.json)).toEqualTypeOf<SQL<unknown>>()
	assertType<SQL<TestJson>>(cast(sql`1`, tests.typedJson))
})
