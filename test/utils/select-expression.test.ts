import { sql } from "drizzle-orm"
import { expect, it } from "vitest"
import { selectExpression } from "./select-expression"

it("should execute expression and return the value", async () => {
	const value = "what are the haps"

	await expect(selectExpression(sql`${value}`)).resolves.toEqual(value)
})
