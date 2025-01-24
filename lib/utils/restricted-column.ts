import type { ColumnBaseConfig, ColumnDataType } from "drizzle-orm"
import type { ColumnBuilderBaseConfig } from "drizzle-orm/column-builder"
import type { PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core"

/** A column builder with restricted `data`, `dataType`, and `columnType` fields. */
export type RestrictedColumnBuilder<
	TData = unknown,
	TDataType extends ColumnDataType = ColumnDataType,
	TColumnType extends string = string,
> = PgColumnBuilder<
	Omit<ColumnBuilderBaseConfig<TDataType, TColumnType>, "data"> & {
		data: TData
	}
>
/** A column with restricted `data`, `dataType`, and `columnType` fields. */
export type RestrictedColumn<
	TData = unknown,
	TDataType extends ColumnDataType = ColumnDataType,
	TColumnType extends string = string,
> = PgColumn<
	Omit<ColumnBaseConfig<TDataType, TColumnType>, "data"> & {
		data: TData
	}
>
