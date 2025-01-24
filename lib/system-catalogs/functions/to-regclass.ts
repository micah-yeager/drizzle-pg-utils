import { type SQL, type SQLWrapper, sql } from "drizzle-orm"

/** @see https://www.postgresql.org/docs/17/functions-info.html#FUNCTIONS-INFO-CATALOG-TABLE */
export function toRegclass(input: SQLWrapper | string): SQL<string | null> {
	const normalized = typeof input === "string" ? sql<string>`${input}` : input
	return sql`to_regclass(${normalized})`
}
