import { type SQL, sql } from "drizzle-orm"
import type { JsonColumn } from "../../functions/json/utils/column-types"
import type { JsonElement } from "./util/types"

/** @see https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-JSON-PROCESSING */
export function jsonElement<TType, TSelector extends string | number>(
	json: JsonColumn<TType> | SQL<TType>,
	selector: TSelector | SQL<TSelector>,
): SQL<JsonElement<TType, [TSelector]>> {
	return sql`${json}->${selector}`
}

/** @see https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-JSON-PROCESSING */
export function jsonElementAsText<TType, TSelector extends string | number>(
	json: JsonColumn<TType> | SQL<TType>,
	selector: TSelector | SQL<TSelector>,
): SQL<JsonElement<TType, [TSelector], { asText: true }>> {
	return sql`${json}->>${selector}`
}
