import { type SQL, type SQLWrapper, sql } from "drizzle-orm"

export function pgTypeof(input: SQLWrapper): SQL<string> {
	return sql`pg_typeof(${input})`
}
