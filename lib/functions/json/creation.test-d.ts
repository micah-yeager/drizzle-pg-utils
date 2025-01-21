import type { SQL } from "drizzle-orm"
import { sql } from "drizzle-orm"
import { describe, expectTypeOf, it } from "vitest"
import { toJson, toJsonb } from "./creation"

type JsonTest = { test: "literal" }

describe("toJson", () => {
	it("should default to unknown", () => {
		expectTypeOf(toJson(sql``)).toEqualTypeOf<SQL<unknown>>()
	})

	it("should pass through generic type", () => {
		expectTypeOf(toJson<string>(sql``)).toEqualTypeOf<SQL<string>>()
		expectTypeOf(toJson<JsonTest>(sql``)).toEqualTypeOf<SQL<JsonTest>>()
	})
})

describe("toJsonb", () => {
	it("should default to unknown", () => {
		expectTypeOf(toJsonb(sql``)).toEqualTypeOf<SQL<unknown>>()
	})

	it("should pass through generic type", () => {
		expectTypeOf(toJson<string>(sql``)).toEqualTypeOf<SQL<string>>()
		expectTypeOf(toJson<JsonTest>(sql``)).toEqualTypeOf<SQL<JsonTest>>()
	})
})
