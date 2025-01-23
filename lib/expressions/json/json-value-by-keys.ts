import { SQL, sql } from "drizzle-orm"
import type { IsAny, IsUnknown } from "type-fest"
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
export function jsonValueByKeys<
	TReturn,
	TType = unknown,
	U extends string | number = string | number,
	TSelectors extends Readonly<[U, ...U[]] | never[]> = Readonly<
		[U, ...U[]] | never[]
	>,
>(
	json: JsonColumn<TType> | SQL<TType>,
	selectors: TSelectors | SQL<TSelectors>,
): SQL<
	IsUnknown<TReturn> extends true ? JsonFieldByKey<TType, TSelectors> : TReturn
> {
	return sql`${json} #> ${normalizeSelectors(selectors)}`
}

/** @see https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-JSON-PROCESSING */
export function jsonFieldByKeysAsText<
	TReturn extends string | null = any,
	TType = unknown,
	U extends string | number = string | number,
	TSelectors extends Readonly<[U, ...U[]] | never[]> = Readonly<
		[U, ...U[]] | never[]
	>,
>(
	json: JsonColumn<TType> | SQL<TType>,
	selectors: TSelectors | SQL<TSelectors>,
): SQL<
	IsAny<TReturn> extends true
		? JsonFieldByKey<TType, TSelectors, { asText: true }>
		: TReturn
> {
	return sql`${json} #>> ${normalizeSelectors(selectors)}`
}
