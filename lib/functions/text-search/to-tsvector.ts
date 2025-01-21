import { type SQL, type SQLWrapper, sql } from "drizzle-orm"

/** @see https://www.postgresql.org/docs/current/functions-textsearch.html#TEXTSEARCH-FUNCTIONS-TABLE */
export function toTsvector(
	text: SQLWrapper | string,
	lang?: SQLWrapper | string,
): SQL<string> {
	const normalizedText = typeof text === "string" ? sql`${text}` : text
	const normalizedLang = typeof lang === "string" ? sql`${lang}` : lang

	if (normalizedLang) {
		return sql`to_tsvector(${normalizedLang},${normalizedText})`
	}
	return sql`to_tsvector(${normalizedText})`
}
