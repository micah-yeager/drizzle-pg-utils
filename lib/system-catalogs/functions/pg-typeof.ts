import { type SQL, type SQLWrapper, sql } from "drizzle-orm"

/** @see https://www.postgresql.org/docs/17/functions-info.html#FUNCTIONS-INFO-CATALOG-TABLE */
export function pgTypeof(input: SQLWrapper): SQL<string> {
	return sql`pg_typeof(${input})`
}
