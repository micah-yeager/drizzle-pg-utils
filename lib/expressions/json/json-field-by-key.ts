import { type SQL, sql } from "drizzle-orm"
import type { JsonColumn } from "../../functions/json/utils/column-types"
import type { JsonFieldByKey } from "./util/types"

/** @see https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-JSON-PROCESSING */
export function jsonFieldByKey<TType, TSelector extends string | number>(
	json: JsonColumn<TType> | SQL<TType>,
	selector: TSelector | SQL<TSelector>,
): SQL<JsonFieldByKey<TType, [TSelector]>> {
	return sql`${json}->${selector}`
}

/** @see https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-JSON-PROCESSING */
export function jsonFieldByKeyAsText<TType, TSelector extends string | number>(
	json: JsonColumn<TType> | SQL<TType>,
	selector: TSelector | SQL<TSelector>,
): SQL<JsonFieldByKey<TType, [TSelector], { asText: true }>> {
	return sql`${json}->>${selector}`
}
