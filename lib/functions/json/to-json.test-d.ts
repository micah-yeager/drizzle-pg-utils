import { type SQL, sql } from "drizzle-orm"
import { expectTypeOf, it } from "vitest"
import { toJson } from "./to-json"

it("should default to unknown", () => {
	expectTypeOf(toJson(sql``)).toEqualTypeOf<SQL<unknown>>()
})

it("should pass through generic type", () => {
	type Test = { test: "literal" }

	expectTypeOf(toJson<string>(sql``)).toEqualTypeOf<SQL<string>>()
	expectTypeOf(toJson<Test>(sql``)).toEqualTypeOf<SQL<Test>>()
})
