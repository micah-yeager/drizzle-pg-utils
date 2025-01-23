import { type SQL, sql } from "drizzle-orm"
import type { IsAny, IsUnknown } from "type-fest"
import type { JsonColumn } from "../../functions/json/utils/column-types"
import type { JsonFieldByKey } from "./util/types"

/** @see https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-JSON-PROCESSING */
export function jsonValueByKey<
	TReturn,
	TType = unknown,
	TSelector extends string | number = string | number,
>(
	json: JsonColumn<TType> | SQL<TType>,
	selector: TSelector | SQL<TSelector>,
): SQL<
	IsUnknown<TReturn> extends true ? JsonFieldByKey<TType, [TSelector]> : TReturn
> {
	return sql`${json}->${selector}`
}

/** @see https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-JSON-PROCESSING */
export function jsonFieldByKeyAsText<
	TReturn extends string | null = any,
	TType = unknown,
	TSelector extends string | number = string | number,
>(
	json: JsonColumn<TType> | SQL<TType>,
	selector: TSelector | SQL<TSelector>,
): SQL<
	IsAny<TReturn> extends true
		? JsonFieldByKey<TType, [TSelector], { asText: true }>
		: TReturn
> {
	return sql`${json}->>${selector}`
}
