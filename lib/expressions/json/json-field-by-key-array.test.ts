import { sql } from "drizzle-orm"
import { json } from "drizzle-orm/pg-core"
import { expect, it } from "vitest"
import { selectExpression } from "../../../test/utils/select-expression"
import { cast } from "../../functions/cast"
import {
	jsonFieldByKeyArray,
	jsonFieldByKeyArrayAsText,
} from "./json-field-by-key-array"

const testObj = { test: 0, nested: { key: "value" } } as const
const keys = ["nested", "key"] as const

it("should execute correctly with jsonFieldByKeyArray", async () => {
	const expression = jsonFieldByKeyArray(
		cast(sql`${JSON.stringify(testObj)}`, json),
		keys,
	)

	await expect(selectExpression(expression)).resolves.toEqual(
		testObj[keys[0]][keys[1]],
	)
})

it("should execute correctly with jsonFieldByKeyArrayAsText", async () => {
	const expression = jsonFieldByKeyArrayAsText(
		cast(sql`${JSON.stringify(testObj)}`, json("").$type<typeof testObj>()),
		keys,
	)

	await expect(selectExpression(expression)).resolves.toEqual(
		testObj[keys[0]][keys[1]],
	)
})
