import type { SQL } from "drizzle-orm"
import type { PgColumn } from "drizzle-orm/pg-core"
import type {
	IsUnknown,
	LiteralToPrimitiveDeep,
	UnionToIntersection,
} from "type-fest"
import type { TypeFromSQL } from "../../util"

/**
 * Separate the `NormalizeInputs` logic, so the `TypeFromSQL<T[number]>` used in
 * {@link NormalizeInputs} can be cached by the TypeScript compiler instead of
 * repeated.
 */
type NormalizeInputsInternal<
	T,
	TPrimitiveFallback extends boolean = true,
> = IsUnknown<T> extends true
	? unknown
	: [T] extends [UnionToIntersection<T>]
		? T
		: TPrimitiveFallback extends true
			? NormalizeInputsInternal<LiteralToPrimitiveDeep<T>, false>
			: never

/**
 * Create a normalized type from raw and column SQL type inputs.
 *
 * The following logic is used:
 *
 * - If any inputs are `unknown`, the type will also be `unknown`.
 * - Otherwise, if the input types all match (i.e. would not generate a union
 *   type), that type will be returned.
 * - Finally, if the input types don't match (i.e. would generate a union type),
 *   the type will be `never`.
 */
export type NormalizeInputs<
	T extends readonly [PgColumn | SQL, ...(PgColumn | SQL)[]],
> = NormalizeInputsInternal<TypeFromSQL<T[number]>>
