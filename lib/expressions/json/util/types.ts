import type {
	ArrayTail,
	IfUnknown,
	IsLiteral,
	JsonArray,
	JsonObject,
	JsonPrimitive,
} from "type-fest"

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
> = Options["asText"] extends true ? Stringify<T> : T // If set, cast the value
// to a string.
/**
 * Extracts the specified deeply-nested element of a JSON array or object,
 * mimicking Postgres behavior.
 */
export type JsonElement<
	TType,
	TSelectors extends Selectors,
	Options extends JsonElementOptions = { asText: false },
> = TSelectors[0] extends undefined // If no more selectors are left, process the
	? // value.
		ProcessValue<TType, Options>
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
