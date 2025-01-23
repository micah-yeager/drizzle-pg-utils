import { sql } from "drizzle-orm"
import { json } from "drizzle-orm/pg-core"
import { expect, it } from "vitest"
import { selectExpression } from "../../../test/utils/select-expression"
import { cast } from "../../functions/cast"
import { jsonFieldByKey, jsonFieldByKeyAsText } from "./json-field-by-key"

const testObj = { test: 0, nested: { key: "value" } } as const
const key = "nested" satisfies keyof typeof testObj

it("should execute correctly with jsonFieldByKey", async () => {
	const expression = jsonFieldByKey(
		cast(sql`${JSON.stringify(testObj)}`, json),
		key,
	)

	await expect(selectExpression(expression)).resolves.toEqual(testObj[key])
})

it("should execute correctly with jsonFieldByKeyAsText", async () => {
	const expression = jsonFieldByKeyAsText(
		cast(sql`${JSON.stringify(testObj)}`, json),
		key,
	)

	await expect(selectExpression(expression)).resolves.toEqual(
		JSON.stringify(testObj[key]),
	)
})
