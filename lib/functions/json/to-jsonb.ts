import type { SQLWrapper } from "drizzle-orm"
import { type SQL, sql } from "drizzle-orm"

/** @see https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-JSON-CREATION-TABLE */
export function toJsonb<TType = unknown>(expression: SQLWrapper): SQL<TType> {
	return sql`to_jsonb(${expression})`
}
