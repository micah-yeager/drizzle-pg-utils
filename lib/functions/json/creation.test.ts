import { sql } from "drizzle-orm"
import { text } from "drizzle-orm/pg-core"
import { expect, it } from "vitest"
import { cast } from "../cast"
import { toJson, toJsonb } from "./creation"

it("should execute toJson correctly", async () => {
	const toTest = toJson(cast(sql`${JSON.stringify({ test: 0 })}`, text))

	const result = await globalThis.db.execute(sql`select ${toTest}`)

	expect(result.rows).toMatchSnapshot()
})

it("should execute toJsonb correctly", async () => {
	const toTest = toJsonb(cast(sql`${JSON.stringify({ test: 0 })}`, text))

	const result = await globalThis.db.execute(sql`select ${toTest}`)

	expect(result.rows).toMatchSnapshot()
})
