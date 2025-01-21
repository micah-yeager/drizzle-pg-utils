import { sql } from "drizzle-orm"
import { expect, it } from "vitest"
import { compareSQLValues } from "./compare-sql-values"

it("should assert successfully with good comparison", async () => {
	expect.assertions(1)
	await compareSQLValues({ input: sql`true`, expected: sql`true` })
})

it.fails("should fail to assert with bad comparison", async () => {
	await compareSQLValues({ input: sql`false`, expected: sql`true` })
})
