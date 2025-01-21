import {
	type ColumnBaseConfig,
	type ColumnBuilderRuntimeConfig,
	type Equal,
	entityKind,
} from "drizzle-orm"
import type {
	ColumnBuilderBaseConfig,
	MakeColumnConfig,
} from "drizzle-orm/column-builder"
import { type AnyPgTable, PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core"
import { getColumnNameAndConfig } from "../../vendor/drizzle-orm/utils"
import {
	type OrdinateObject,
	type OrdinateTuple,
	parseOrdinatePairs,
} from "./utils/geometric"

// Tuple

export type PgLsegTuplesBuilderInitial<TName extends string> =
	PgLsegTuplesBuilder<{
		name: TName
		dataType: "json"
		columnType: "PgLsegTuples"
		data: [OrdinateTuple, OrdinateTuple]
		driverParam: string
		enumValues: undefined
	}>

export class PgLsegTuplesBuilder<
	T extends ColumnBuilderBaseConfig<"json", "PgLsegTuples">,
> extends PgColumnBuilder<T> {
	static override readonly [entityKind]: string = "PgLsegTuplesBuilder"

	constructor(name: string) {
		super(name, "json", "PgLsegTuples")
	}

	/** @internal */
	build<TTableName extends string>(
		table: AnyPgTable<{ name: TTableName }>,
	): PgLsegTuples<MakeColumnConfig<T, TTableName>> {
		return new PgLsegTuples<MakeColumnConfig<T, TTableName>>(
			table,
			this.config as ColumnBuilderRuntimeConfig<any, any>,
		)
	}
}

export class PgLsegTuples<
	T extends ColumnBaseConfig<"json", "PgLsegTuples">,
> extends PgColumn<T> {
	static override readonly [entityKind]: string = "PgLsegTuples"

	getSQLType(): string {
		return "lseg"
	}

	override mapFromDriverValue(value: string): [OrdinateTuple, OrdinateTuple] {
		// Slice to remove encasing `[]`.
		return parseOrdinatePairs(value.slice(1, -1), { limit: true })
	}

	override mapToDriverValue([[x1, y1], [x2, y2]]: [
		OrdinateTuple,
		OrdinateTuple,
	]): string {
		return `[(${x1},${y1}),(${x2},${y2})]`
	}
}

// Object

export type PgLsegObjectsBuilderInitial<TName extends string> =
	PgLsegObjectsBuilder<{
		name: TName
		dataType: "json"
		columnType: "PgLsegObjects"
		data: [OrdinateObject, OrdinateObject]
		driverParam: string
		enumValues: undefined
	}>

export class PgLsegObjectsBuilder<
	T extends ColumnBuilderBaseConfig<"json", "PgLsegObjects">,
> extends PgColumnBuilder<T> {
	static override readonly [entityKind]: string = "PgLsegObjectsBuilder"

	constructor(name: string) {
		super(name, "json", "PgLsegObjects")
	}

	/** @internal */
	build<TTableName extends string>(
		table: AnyPgTable<{ name: TTableName }>,
	): PgLsegObjects<MakeColumnConfig<T, TTableName>> {
		return new PgLsegObjects<MakeColumnConfig<T, TTableName>>(
			table,
			this.config as ColumnBuilderRuntimeConfig<any, any>,
		)
	}
}

export class PgLsegObjects<
	T extends ColumnBaseConfig<"json", "PgLsegObjects">,
> extends PgColumn<T> {
	static override readonly [entityKind]: string = "PgLsegObjects"

	getSQLType(): string {
		return "lseg"
	}

	override mapFromDriverValue(value: string): [OrdinateObject, OrdinateObject] {
		// Slice to remove encasing `[]`.
		return parseOrdinatePairs(value.slice(1, -1), { xy: true, limit: true })
	}

	override mapToDriverValue([{ x: x1, y: y1 }, { x: x2, y: y2 }]: [
		OrdinateObject,
		OrdinateObject,
	]): string {
		return `[(${x1},${y1}),(${x2},${y2})]`
	}
}

// Shared

export interface PgLsegConfig<T extends "tuple" | "xy" = "tuple" | "xy"> {
	mode?: T
}

/** @see https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-LSEG */
export function lseg(): PgLsegTuplesBuilderInitial<"">
/** @see https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-LSEG */
export function lseg<TMode extends PgLsegConfig["mode"] & {}>(
	config?: PgLsegConfig<TMode>,
): Equal<TMode, "xy"> extends true
	? PgLsegObjectsBuilderInitial<"">
	: PgLsegTuplesBuilderInitial<"">
/** @see https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-LSEG */
export function lseg<
	TName extends string,
	TMode extends PgLsegConfig["mode"] & {},
>(
	name: TName,
	config?: PgLsegConfig<TMode>,
): Equal<TMode, "xy"> extends true
	? PgLsegObjectsBuilderInitial<TName>
	: PgLsegTuplesBuilderInitial<TName>
export function lseg(a?: string | PgLsegConfig, b?: PgLsegConfig) {
	const { name, config } = getColumnNameAndConfig<PgLsegConfig>(a, b)
	if (config?.mode === "xy") {
		return new PgLsegObjectsBuilder(name) as PgLsegObjectsBuilderInitial<string>
	}
	return new PgLsegTuplesBuilder(name) as PgLsegTuplesBuilderInitial<string>
}
