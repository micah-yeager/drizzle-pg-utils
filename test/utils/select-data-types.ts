import { and, eq, gt, is, not, sql } from "drizzle-orm"
import { PgTable, type PgView } from "drizzle-orm/pg-core"
import { expect } from "vitest"
import { cast } from "../../lib/functions/cast"
import { regclass } from "../../lib/system-catalogs/columns/regclass"
import { formatType } from "../../lib/system-catalogs/functions/format-type"
import { pgAttribute } from "../../lib/system-catalogs/pg-attribute"
import { pgClass } from "../../lib/system-catalogs/pg-class"

const TableName = Symbol.for("drizzle:Name")
const ViewBaseConfig = Symbol.for("drizzle:ViewBaseConfig")

/**
 * Get specific data types for a table's columns.
 *
 * Returns a dynamic query, which can be further refined to target specific
 * columns.
 *
 * @example
 *
 * ```ts
 * await queryTableDataTypes(table)
 * // [
 * //   { columnName: 'idField', dataType: 'integer' },
 * //   { columnName: 'field1', dataType: 'bpchar' }
 * //   { columnName: 'field2', dataType: 'box' }
 * // ]
 * ```
 *
 * @example
 *
 * ```ts
 * await queryTableDataTypes(table).where(
 *   or(
 *     eq(pgAttribute.attname, table.field1.name),
 *     eq(pgAttribute.attname, table.field2.name),
 *   )
 * )
 * // [
 * //   { columnName: 'field1', dataType: 'bpchar' }
 * //   { columnName: 'field2', dataType: 'box' }
 * // ]
 * ```
 *
 * @param tableOrView - A table or view.
 */
export function selectDataTypes(tableOrView: PgTable | PgView) {
	const tableName: string = is(tableOrView, PgTable)
		? // @ts-expect-error: Not part of the type, but does exist.
			tableOrView[TableName]
		: // @ts-expect-error: Not part of the type, but does exist.
			tableOrView[ViewBaseConfig].name

	return globalThis.db
		.select({
			columnName: pgAttribute.attname,
			dataType: formatType(pgAttribute.atttypid, pgAttribute.atttypmod),
		})
		.from(pgAttribute)
		.innerJoin(pgClass, eq(pgAttribute.attrelid, pgClass.oid))
		.where(
			and(
				gt(pgAttribute.attnum, 0),
				not(pgAttribute.attisdropped),
				eq(pgClass.oid, cast(sql`${tableName}`, regclass)),
			),
		)
		.$dynamic()
}

export function expectDataType(
	rows: Awaited<ReturnType<typeof selectDataTypes>>,
	columnName: string,
	dataTypeName: string,
): void {
	// biome-ignore lint/suspicious/noMisplacedAssertion: Helper function for `expect`.
	expect(rows.find((row) => row.columnName === columnName)?.dataType).toEqual(
		dataTypeName,
	)
}
