import {
	type ColumnBaseConfig,
	type ColumnBuilderRuntimeConfig,
	type Equal,
	entityKind,
	getColumnNameAndConfig,
} from "drizzle-orm"
import type {
	ColumnBuilderBaseConfig,
	MakeColumnConfig,
} from "drizzle-orm/column-builder"
import { type AnyPgTable, PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core"
import {
	type OrdinateObject,
	type OrdinateTuple,
	parseOrdinatePairs,
} from "./utils/geometric"

// Tuple

export type PgPolygonTuplesBuilderInitial<TName extends string> =
	PgPolygonTuplesBuilder<{
		name: TName
		dataType: "json"
		columnType: "PgPolygonTuples"
		data: [OrdinateTuple, OrdinateTuple, ...OrdinateTuple[]]
		driverParam: string
		enumValues: undefined
	}>

export class PgPolygonTuplesBuilder<
	T extends ColumnBuilderBaseConfig<"json", "PgPolygonTuples">,
> extends PgColumnBuilder<T> {
	static override readonly [entityKind]: string = "PgPolygonTuplesBuilder"

	constructor(name: string) {
		super(name, "json", "PgPolygonTuples")
	}

	/** @internal */
	build<TTableName extends string>(
		table: AnyPgTable<{ name: TTableName }>,
	): PgPolygonTuples<MakeColumnConfig<T, TTableName>> {
		return new PgPolygonTuples<MakeColumnConfig<T, TTableName>>(
			table,
			this.config as ColumnBuilderRuntimeConfig<any, any>,
		)
	}
}

export class PgPolygonTuples<
	T extends ColumnBaseConfig<"json", "PgPolygonTuples">,
> extends PgColumn<T> {
	static override readonly [entityKind]: string = "PgPolygonTuples"

	getSQLType(): string {
		return "polygon"
	}

	override mapFromDriverValue(
		value: string,
	): [OrdinateTuple, OrdinateTuple, ...OrdinateTuple[]] {
		// Slice to remove encasing `()`.
		return parseOrdinatePairs(value.slice(1, -1))
	}

	override mapToDriverValue(
		points: [OrdinateTuple, OrdinateTuple, ...OrdinateTuple[]],
	): string {
		const pairs = points.map(([x, y]) => `(${x},${y})`).join(",")
		return `(${pairs})`
	}
}

// Object

export type PgPolygonObjectsBuilderInitial<TName extends string> =
	PgPolygonObjectsBuilder<{
		name: TName
		dataType: "json"
		columnType: "PgPolygonObjects"
		data: [OrdinateObject, OrdinateObject, ...OrdinateObject[]]
		driverParam: string
		enumValues: undefined
	}>

export class PgPolygonObjectsBuilder<
	T extends ColumnBuilderBaseConfig<"json", "PgPolygonObjects">,
> extends PgColumnBuilder<T> {
	static override readonly [entityKind]: string = "PgPolygonObjectsBuilder"

	constructor(name: string) {
		super(name, "json", "PgPolygonObjects")
	}

	/** @internal */
	build<TTableName extends string>(
		table: AnyPgTable<{ name: TTableName }>,
	): PgPolygonObjects<MakeColumnConfig<T, TTableName>> {
		return new PgPolygonObjects<MakeColumnConfig<T, TTableName>>(
			table,
			this.config as ColumnBuilderRuntimeConfig<any, any>,
		)
	}
}

export class PgPolygonObjects<
	T extends ColumnBaseConfig<"json", "PgPolygonObjects">,
> extends PgColumn<T> {
	static override readonly [entityKind]: string = "PgPolygonObjects"

	getSQLType(): string {
		return "polygon"
	}

	override mapFromDriverValue(
		value: string,
	): [OrdinateObject, OrdinateObject, ...OrdinateObject[]] {
		// Slice to remove encasing `()`.
		return parseOrdinatePairs(value.slice(1, -1), { xy: true })
	}

	override mapToDriverValue(
		points: [OrdinateObject, OrdinateObject, ...OrdinateObject[]],
	): string {
		const pairs = points.map(({ x, y }) => `(${x},${y})`).join(",")
		return `(${pairs})`
	}
}

// Shared

export interface PgPolygonConfig<T extends "tuple" | "xy" = "tuple" | "xy"> {
	mode?: T
}

/** @see https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-POLYGON */
export function polygon(): PgPolygonTuplesBuilderInitial<"">
/** @see https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-POLYGON */
export function polygon<TMode extends PgPolygonConfig["mode"] & {}>(
	config?: PgPolygonConfig<TMode>,
): Equal<TMode, "xy"> extends true
	? PgPolygonObjectsBuilderInitial<"">
	: PgPolygonTuplesBuilderInitial<"">
/** @see https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-POLYGON */
export function polygon<
	TName extends string,
	TMode extends PgPolygonConfig["mode"] & {},
>(
	name: TName,
	config?: PgPolygonConfig<TMode>,
): Equal<TMode, "xy"> extends true
	? PgPolygonObjectsBuilderInitial<TName>
	: PgPolygonTuplesBuilderInitial<TName>
export function polygon(a?: string | PgPolygonConfig, b?: PgPolygonConfig) {
	const { name, config } = getColumnNameAndConfig<PgPolygonConfig>(a, b)
	if (config?.mode === "xy") {
		return new PgPolygonObjectsBuilder(
			name,
		) as PgPolygonObjectsBuilderInitial<string>
	}
	return new PgPolygonTuplesBuilder(
		name,
	) as PgPolygonTuplesBuilderInitial<string>
}
