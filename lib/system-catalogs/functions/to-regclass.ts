import { type SQL, type SQLWrapper, sql } from "drizzle-orm"

export function toRegclass(input: SQLWrapper | string): SQL<string | null> {
	const normalized = typeof input === "string" ? sql<string>`${input}` : input
	return sql`to_regclass(${normalized})`
}
