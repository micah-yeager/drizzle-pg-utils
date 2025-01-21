import { sql } from "drizzle-orm"
import { expect, it } from "vitest"
import { selectExpression } from "../../../test/utils/select-expression"
import { toRegclass } from "./to-regclass"

it("should accept SQL input", async () => {
	const regClassName = "pg_attribute"

	await expect(
		selectExpression(toRegclass(sql`${regClassName}`)),
	).resolves.toEqual(regClassName)
})

it("should accept string input", async () => {
	const regClassName = "pg_attribute"

	await expect(selectExpression(toRegclass(regClassName))).resolves.toEqual(
		regClassName,
	)
})

it("should return null on non-existent regclass", async () => {
	await expect(
		selectExpression(toRegclass("__this_should_not_exist__")),
	).resolves.toEqual(null)
})
