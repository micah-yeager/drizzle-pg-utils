import { sql } from "drizzle-orm"
import { describe, expect, it } from "vitest"
import { selectExpression } from "../../../test/utils/select-expression"
import { toTsvector } from "./to-tsvector"

const value = "what are the haps"
const result = "'hap':4"

describe("with language", () => {
	const language = "english"

	it("should accept SQL input", async () => {
		await expect(
			selectExpression(toTsvector(sql`${value}`, sql`${language}`)),
		).resolves.toEqual(result)
	})

	it("should accept string input", async () => {
		await expect(
			selectExpression(toTsvector(value, language)),
		).resolves.toEqual(result)
	})
})

describe("no language", () => {
	it("should accept SQL input", async () => {
		await expect(selectExpression(toTsvector(sql`${value}`))).resolves.toEqual(
			result,
		)
	})

	it("should accept string input", async () => {
		await expect(selectExpression(toTsvector(value))).resolves.toEqual(result)
	})
})
