import { SQL, sql } from "drizzle-orm"
import type {
	ArrayTail,
	IfUnknown,
	IsLiteral,
	JsonArray,
	JsonObject,
	JsonPrimitive,
} from "type-fest"
import type { JsonColumn } from "./util"

/** Options for extracting a JSON element. */
type JsonElementOptions = { asText?: boolean }

/** A tuple of selectors for a nested JSON element. */
type Selectors = Readonly<[string | number, ...(string | number)[]] | never[]>

/** Converts a type to a string, preserving literals where possible. */
type Stringify<T> = IfUnknown<
	T,
	string | null,
	T extends JsonPrimitive
		? // Only bother trying to preserve the type if it's a literal.
			IsLiteral<T> extends true
			? `${T}`
			: string
		: string
>

/** Processes the value based on the provided options. */
type ProcessValue<
	T,
	Options extends JsonElementOptions,
> = Options["asText"] extends true ? Stringify<T> : T // If set, cast the value to a string.

/**
 * Extracts the specified deeply-nested element of a JSON array or object,
 * mimicking Postgres behavior.
 */
type JsonElement<
	TType,
	TSelectors extends Selectors,
	Options extends JsonElementOptions = { asText: false },
> = TSelectors[0] extends undefined // If no more selectors are left, process the value.
	? ProcessValue<TType, Options>
	: // Postgres can only select objects keys and array indices, not
		// string indices.
		TType extends JsonObject | JsonArray
		? TSelectors[0] extends keyof TType
			? // "Cast" undefined to null.
				TType[TSelectors[0]] extends undefined
				? null
				: // Check to satisfy the type checker.
					Readonly<ArrayTail<TSelectors>> extends Selectors
					? JsonElement<
							TType[TSelectors[0]],
							Readonly<ArrayTail<TSelectors>>,
							Options
						>
					: "! Invalid selector type:" & Readonly<ArrayTail<TSelectors>>
			: null
		: IfUnknown<TType, ProcessValue<TType, Options>, null>

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
	return sql`${json}->${selector}`
}

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
