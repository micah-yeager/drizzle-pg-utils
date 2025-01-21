import { sql } from "drizzle-orm"
import { expect, it } from "vitest"
import { selectExpression } from "../../../test/utils/select-expression"
import { pgTypeof } from "./pg-typeof"

it("should return SQL data type", async () => {
	await expect(selectExpression(pgTypeof(sql`0`))).resolves.toEqual("integer")
})
