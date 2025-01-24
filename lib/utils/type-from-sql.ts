import type { SQL } from "drizzle-orm"

/** Options to use when extracting a type. */
type ParseTypeOptions = { nullable: boolean }
/** Manually-provided type information for a column builder. */
type ColumnBuilderType<T, TNotNull extends boolean> = {
	_: { $type: T; notNull: TNotNull }
}
/** Type information for a column. */
type ColumnType<T, TNotNull extends boolean> = {
	_: { data: T; notNull: TNotNull }
}
/** Parse the final type using nullability information. */
type ParseType<
	T,
	TNotNull extends boolean,
	Options extends ParseTypeOptions,
> = Options extends { nullable: false }
	? T
	: TNotNull extends true
		? T
		: T | null
/** Retrieve the resulting type from a column, column builder, or SQL expression. */
export type TypeFromSQL<
	T,
	Options extends ParseTypeOptions = { nullable: true },
> = T extends ColumnBuilderType<infer U, infer TNotNull> // Set if `.$type()` is
	? // used with the column
		// builder.
		ParseType<U, TNotNull, Options>
	: // Fall back to the column default data type.
		T extends ColumnType<infer U, infer TNotNull>
		? ParseType<U, TNotNull, Options>
		: // Otherwise, if this is a SQL class, return the type generic.
			T extends SQL<infer U>
			? U
			: never
