import { type SQL, type SQLWrapper, is, sql } from "drizzle-orm"
import { PgColumn, PgColumnBuilder, PgTable } from "drizzle-orm/pg-core"
import type { IsAny, IsUnknown } from "type-fest"
import type { TypeFromSQL } from "../utils/type-from-sql"
import { PgUtilFunctionError } from "./util/error"

/** A blank table to use for casting. */
const blankTable = new PgTable("", undefined, "")

/** @see https://www.postgresql.org/docs/17/sql-expressions.html#SQL-SYNTAX-TYPE-CASTS */
export function cast<
	TReturn,
	TType extends PgColumn | PgColumnBuilder<any> | string = any,
>(
	expression: SQLWrapper,
	type: TType | ((...args: any[]) => TType),
): SQL<
	IsUnknown<TReturn> extends true
		? IsAny<TType> extends true
			? unknown
			: TType extends string
				? unknown
				: TypeFromSQL<TType, { nullable: false }>
		: TReturn
> {
	const unwrappedType = typeof type === "function" ? type() : type

	let normalizedType: string
	// String.
	if (typeof unwrappedType === "string") {
		normalizedType = unwrappedType
	}
	// Column instance.
	else if (is(unwrappedType, PgColumn)) {
		normalizedType = unwrappedType.getSQLType()
	}
	// Column builder instance.
	else if (is(unwrappedType, PgColumnBuilder)) {
		normalizedType = unwrappedType.build(blankTable).getSQLType()
	}
	// Throw error if not matched.
	else {
		throw new PgUtilFunctionError(
			`${String(type)} is not a column, column builder, or string`,
		)
	}

	return sql`cast(${expression} as ${sql.raw(normalizedType)})`
}
