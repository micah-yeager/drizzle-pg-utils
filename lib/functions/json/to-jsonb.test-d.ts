import type { SQL } from "drizzle-orm"
import { sql } from "drizzle-orm"
import { expectTypeOf, it } from "vitest"
import { toJson } from "./to-json"
import { toJsonb } from "./to-jsonb"

it("should default to unknown", () => {
	expectTypeOf(toJsonb(sql``)).toEqualTypeOf<SQL<unknown>>()
})

it("should pass through generic type", () => {
	type Test = { test: "literal" }

	expectTypeOf(toJson<string>(sql``)).toEqualTypeOf<SQL<string>>()
	expectTypeOf(toJson<Test>(sql``)).toEqualTypeOf<SQL<Test>>()
})
