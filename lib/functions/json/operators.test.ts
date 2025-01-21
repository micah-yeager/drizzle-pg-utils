import { sql } from "drizzle-orm"
import { json } from "drizzle-orm/pg-core"
import { expect, it } from "vitest"
import { cast } from "../cast"
import {
	jsonElement,
	jsonElementAsText,
	jsonElementFromPathArray,
	jsonElementFromPathArrayAsText,
} from "./operators"

const testObj = { test: 0, nested: { key: "value" } } as const

it("should execute correctly with jsonElement", async () => {
	const toTest = jsonElement(
		cast(sql`${JSON.stringify(testObj)}`, json("").$type<typeof testObj>()),
		"nested",
	)

	const result = await globalThis.db.execute(sql`select ${toTest}`)

	expect(result.rows).toMatchSnapshot()
})

it("should execute correctly with jsonElementAsText", async () => {
	const toTest = jsonElementAsText(
		cast(sql`${JSON.stringify(testObj)}`, json("").$type<typeof testObj>()),
		"nested",
	)

	const result = await globalThis.db.execute(sql`select ${toTest}`)

	expect(result.rows).toMatchSnapshot()
})

it("should execute correctly with jsonElementFromPathArray", async () => {
	const toTest = jsonElementFromPathArray(
		cast(sql`${JSON.stringify(testObj)}`, json("").$type<typeof testObj>()),
		["nested", "key"],
	)

	const result = await globalThis.db.execute(sql`select ${toTest}`)

	expect(result.rows).toMatchSnapshot()
})

it("should execute correctly with jsonElementFromPathArrayAsText", async () => {
	const toTest = jsonElementFromPathArrayAsText(
		cast(sql`${JSON.stringify(testObj)}`, json("").$type<typeof testObj>()),
		["nested", "key"],
	)

	const result = await globalThis.db.execute(sql`select ${toTest}`)

	expect(result.rows).toMatchSnapshot()
})
