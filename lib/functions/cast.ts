import { type SQL, type SQLWrapper, sql } from "drizzle-orm"
import type {
	ColumnBuilderBase,
	ColumnBuilderBaseConfig,
	ColumnDataType,
	MakeColumnConfig,
} from "drizzle-orm/column-builder"
import {
	type AnyPgTable,
	PgColumn,
	type PgColumnBuilder,
	PgTable,
} from "drizzle-orm/pg-core"
import type { TypeFromSQL } from "../util"

/** Mimic the internal `build` method on PgColumnBuilder. */
interface PgColumnBuilder_ extends PgColumnBuilder {
	build(
		table: AnyPgTable<{ name: string }>,
	): PgColumn<
		MakeColumnConfig<ColumnBuilderBaseConfig<ColumnDataType, string>, string>
	>
}

/** A blank table to use for casting. */
const blankTable = new PgTable("", undefined, "")

/** @see https://www.postgresql.org/docs/17/sql-expressions.html#SQL-SYNTAX-TYPE-CASTS */
export function cast<T extends PgColumn | ColumnBuilderBase>(
	expression: SQLWrapper,
	type: T | ((...args: any[]) => T),
): SQL<TypeFromSQL<T, { nullable: false }>> {
	let sqlType: string
	// Column instance.
	if (type instanceof PgColumn) {
		sqlType = type.getSQLType()
	}
	// Column builder.
	else {
		const builder = (
			typeof type === "object" ? type : type()
		) as PgColumnBuilder_
		sqlType = builder.build(blankTable).getSQLType()
	}

	return sql`cast(${expression} as ${sql.raw(sqlType)})`
}
