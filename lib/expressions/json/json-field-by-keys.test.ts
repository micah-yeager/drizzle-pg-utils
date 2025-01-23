import { sql } from "drizzle-orm"
import { json } from "drizzle-orm/pg-core"
import { expect, it } from "vitest"
import { selectExpression } from "../../../test/utils/select-expression"
import { cast } from "../../functions/cast"
import { jsonFieldByKeys, jsonFieldByKeysAsText } from "./json-field-by-keys"

const testObj = { test: 0, nested: { key: "value" } } as const
const keys = ["nested", "key"] as const

it("should execute correctly with jsonFieldByKeys", async () => {
	const expression = jsonFieldByKeys(
		cast(sql`${JSON.stringify(testObj)}`, json),
		keys,
	)

	await expect(selectExpression(expression)).resolves.toEqual(
		testObj[keys[0]][keys[1]],
	)
})

it("should execute correctly with jsonFieldByKeysAsText", async () => {
	const expression = jsonFieldByKeysAsText(
		cast(sql`${JSON.stringify(testObj)}`, json("").$type<typeof testObj>()),
		keys,
	)

	await expect(selectExpression(expression)).resolves.toEqual(
		testObj[keys[0]][keys[1]],
	)
})
