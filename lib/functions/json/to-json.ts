import { type SQL, type SQLWrapper, sql } from "drizzle-orm"

/** @see https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-JSON-CREATION-TABLE */
export function toJson<TType = unknown>(expression: SQLWrapper): SQL<TType> {
	return sql`to_json(${expression})`
}
