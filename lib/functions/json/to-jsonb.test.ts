import { sql } from "drizzle-orm"
import { integer, text } from "drizzle-orm/pg-core"
import { expect, it } from "vitest"
import { selectExpression } from "../../../test/utils/select-expression"
import { cast } from "../cast"
import { toJsonb } from "./to-jsonb"

it("should return number as number", async () => {
	const value = 0
	const expression = toJsonb(cast(sql`${value}`, integer))

	await expect(selectExpression(expression)).resolves.toEqual(value)
})

it("should return object as JSON string", async () => {
	const value = { test: 0 }
	const expression = toJsonb(cast(sql`${value}`, text))

	await expect(selectExpression(expression)).resolves.toEqual(
		JSON.stringify(value),
	)
})
