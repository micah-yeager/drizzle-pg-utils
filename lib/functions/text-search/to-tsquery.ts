import { type SQL, type SQLWrapper, sql } from "drizzle-orm"

/** @see https://www.postgresql.org/docs/current/functions-textsearch.html#TEXTSEARCH-FUNCTIONS-TABLE */
export function toTsquery(
	vector: SQLWrapper | string,
	lang?: SQLWrapper | string,
): SQL<string> {
	const normalizedVector = typeof vector === "string" ? sql`${vector}` : vector
	const normalizedLang = typeof lang === "string" ? sql`${lang}` : lang

	if (normalizedLang) {
		return sql`to_tsquery(${normalizedLang},${normalizedVector})`
	}
	return sql`to_tsquery(${normalizedVector})`
}
