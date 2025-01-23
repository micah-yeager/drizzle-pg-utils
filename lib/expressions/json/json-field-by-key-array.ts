import { SQL, sql } from "drizzle-orm"
import type { JsonColumn } from "../../functions/json/utils/column-types"
import type { JsonFieldByKey } from "./util/types"

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
	)}]`
}

/** @see https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-JSON-PROCESSING */
export function jsonFieldByKeyArray<
	TType,
	U extends string | number,
	TSelectors extends Readonly<[U, ...U[]] | never[]>,
>(
	json: JsonColumn<TType> | SQL<TType>,
	selectors: TSelectors | SQL<TSelectors>,
): SQL<JsonFieldByKey<TType, TSelectors>> {
	return sql`${json}#>${normalizeSelectors(selectors)}`
}

/** @see https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-JSON-PROCESSING */
export function jsonFieldByKeyArrayAsText<
	TType,
	U extends string | number,
	TSelectors extends Readonly<[U, ...U[]] | never[]>,
>(
	json: JsonColumn<TType> | SQL<TType>,
	selectors: TSelectors | SQL<TSelectors>,
): SQL<JsonFieldByKey<TType, TSelectors, { asText: true }>> {
	return sql`${json}#>>${normalizeSelectors(selectors)}`
}
