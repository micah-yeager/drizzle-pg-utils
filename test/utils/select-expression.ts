import { type SQL, sql } from "drizzle-orm"

export async function selectExpression<TType>(expression: SQL<TType>) {
	const {
		rows: [row],
	} = await globalThis.db.execute<Record<"test", TType>>(
		sql`select ${expression} as test`,
	)

	return row.test
}
