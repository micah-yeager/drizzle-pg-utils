import { sql } from "drizzle-orm"
import { json } from "drizzle-orm/pg-core"
import { expect, it } from "vitest"
import { selectExpression } from "../../../test/utils/select-expression"
import { cast } from "../../functions/cast"
import { jsonElement, jsonElementAsText } from "./json-element"

const testObj = { test: 0, nested: { key: "value" } } as const
const key = "nested" satisfies keyof typeof testObj

it("should execute correctly with jsonElement", async () => {
	const expression = jsonElement(
		cast(sql`${JSON.stringify(testObj)}`, json),
		key,
	)

	await expect(selectExpression(expression)).resolves.toEqual(testObj[key])
})

it("should execute correctly with jsonElementAsText", async () => {
	const expression = jsonElementAsText(
		cast(sql`${JSON.stringify(testObj)}`, json),
		key,
	)

	await expect(selectExpression(expression)).resolves.toEqual(testObj[key])
})
