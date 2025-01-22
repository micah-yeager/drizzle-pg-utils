import { type SQL, sql } from "drizzle-orm"

const COLUMN_ALIAS = "__test__"

export async function selectExpression<TType>(expression: SQL<TType>) {
	const result = await globalThis.db.execute<
		Record<typeof COLUMN_ALIAS, TType>
	>(sql`select ${expression} as ${sql.raw(COLUMN_ALIAS)}`)
	return result.rows[0][COLUMN_ALIAS]
}
