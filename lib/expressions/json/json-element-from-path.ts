import { SQL, sql } from "drizzle-orm"
import type { JsonColumn } from "../../functions/json/util"
import type { JsonElement } from "./util/types"

/**
 * Normalizes the selectors for a JSON path array.
 *
 * @param selectors - The selectors to normalize.
 */
function normalizeSelectors<
	U extends string | number,
	TSelectors extends Readonly<[U, ...U[]] | never[]>,
>(selectors: TSelectors | SQL<TSelectors>): SQL<TSelectors> {
	if (selectors instanceof SQL) return selectors

	return sql`array[${sql.join(
		selectors.map((item) => sql`${String(item)}`),
		sql.raw(","),
	)}]` as SQL<TSelectors>
}

/** @see https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-JSON-PROCESSING */
export function jsonElementFromPathArray<
	TType,
	U extends string | number,
	TSelectors extends Readonly<[U, ...U[]] | never[]>,
>(
	json: JsonColumn<TType> | SQL<TType>,
	selectors: TSelectors | SQL<TSelectors>,
): SQL<JsonElement<TType, TSelectors>> {
	return sql`${json}#>${normalizeSelectors(selectors)}`
}

/** @see https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-JSON-PROCESSING */
export function jsonElementFromPathArrayAsText<
	TType,
	U extends string | number,
	TSelectors extends Readonly<[U, ...U[]] | never[]>,
>(
	json: JsonColumn<TType> | SQL<TType>,
	selectors: TSelectors | SQL<TSelectors>,
): SQL<JsonElement<TType, TSelectors, { asText: true }>> {
	return sql`${json}#>>${normalizeSelectors(selectors)}`
}
