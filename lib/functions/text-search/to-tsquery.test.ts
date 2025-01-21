import { sql } from "drizzle-orm"
import { describe, expect, it } from "vitest"
import { selectExpression } from "../../../test/utils/select-expression"
import { toTsquery } from "./to-tsquery"

const value = "what & are & the & haps"
const result = "'hap'"

describe("with language", () => {
	const language = "english"

	it("should accept SQL input", async () => {
		await expect(
			selectExpression(toTsquery(sql`${value}`, sql`${language}`)),
		).resolves.toEqual(result)
	})

	it("should accept string input", async () => {
		await expect(selectExpression(toTsquery(value, language))).resolves.toEqual(
			result,
		)
	})
})

describe("no language", () => {
	it("should accept SQL input", async () => {
		await expect(selectExpression(toTsquery(sql`${value}`))).resolves.toEqual(
			result,
		)
	})

	it("should accept string input", async () => {
		await expect(selectExpression(toTsquery(value))).resolves.toEqual(result)
	})
})
