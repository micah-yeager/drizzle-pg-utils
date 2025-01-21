import type { SQLWrapper } from "drizzle-orm"
import { eq, sql } from "drizzle-orm"
import { expect } from "vitest"

export type CompareSqlCase = {
	input: SQLWrapper
	expected: SQLWrapper
}

export async function compareSQLValues({
	input,
	expected,
}: CompareSqlCase): Promise<void> {
	const expression = eq(input, expected)

	const result = await globalThis.db.execute<{ result: boolean }>(
		sql`select ${expression} as result`,
	)

	// biome-ignore lint/suspicious/noMisplacedAssertion: <explanation>
	expect(result.rows[0].result).toBe(true)
}
