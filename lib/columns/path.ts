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

export type PathTuples = {
	closed: boolean
	points: [OrdinateTuple, OrdinateTuple, ...OrdinateTuple[]]
}
export type PathObjects = {
	closed: boolean
	points: [OrdinateObject, OrdinateObject, ...OrdinateObject[]]
}

// Tuple

export type PgPathTuplesBuilderInitial<TName extends string> =
	PgPathTuplesBuilder<{
		name: TName
		dataType: "json"
		columnType: "PgPathTuples"
		data: PathTuples
		driverParam: string
		enumValues: undefined
	}>

export class PgPathTuplesBuilder<
	T extends ColumnBuilderBaseConfig<"json", "PgPathTuples">,
> extends PgColumnBuilder<T> {
	static override readonly [entityKind]: string = "PgPathTuplesBuilder"

	constructor(name: string) {
		super(name, "json", "PgPathTuples")
	}

	/** @internal */
	build<TTableName extends string>(
		table: AnyPgTable<{ name: TTableName }>,
	): PgPathTuples<MakeColumnConfig<T, TTableName>> {
		return new PgPathTuples<MakeColumnConfig<T, TTableName>>(
			table,
			this.config as ColumnBuilderRuntimeConfig<any, any>,
		)
	}
}

export class PgPathTuples<
	T extends ColumnBaseConfig<"json", "PgPathTuples">,
> extends PgColumn<T> {
	static override readonly [entityKind]: string = "PgPathTuples"

	getSQLType(): string {
		return "path"
	}

	override mapFromDriverValue(value: string): PathTuples {
		return {
			closed: value.startsWith("("),
			points: parseOrdinatePairs(value.slice(1, -1)),
		} as PathTuples
	}

	override mapToDriverValue({ closed, points }: PathTuples): string {
		const pairs = points.map(([x, y]) => `(${x},${y})`).join(",")
		return closed ? `(${pairs})` : `[${pairs}]`
	}
}

// Object

export type PgPathObjectsBuilderInitial<TName extends string> =
	PgPathObjectsBuilder<{
		name: TName
		dataType: "json"
		columnType: "PgPathObjects"
		data: PathObjects
		driverParam: string
		enumValues: undefined
	}>

export class PgPathObjectsBuilder<
	T extends ColumnBuilderBaseConfig<"json", "PgPathObjects">,
> extends PgColumnBuilder<T> {
	static override readonly [entityKind]: string = "PgPathObjectsBuilder"

	constructor(name: string) {
		super(name, "json", "PgPathObjects")
	}

	/** @internal */
	build<TTableName extends string>(
		table: AnyPgTable<{ name: TTableName }>,
	): PgPathObjects<MakeColumnConfig<T, TTableName>> {
		return new PgPathObjects<MakeColumnConfig<T, TTableName>>(
			table,
			this.config as ColumnBuilderRuntimeConfig<any, any>,
		)
	}
}

export class PgPathObjects<
	T extends ColumnBaseConfig<"json", "PgPathObjects">,
> extends PgColumn<T> {
	static override readonly [entityKind]: string = "PgPathObjects"

	getSQLType(): string {
		return "path"
	}

	override mapFromDriverValue(value: string): PathObjects {
		return {
			closed: value.startsWith("("),
			points: parseOrdinatePairs(value.slice(1, -1), { xy: true }),
		} as PathObjects
	}

	override mapToDriverValue({ closed, points }: PathObjects): string {
		const pairs = points.map(({ x, y }) => `(${x},${y})`).join(",")
		return closed ? `(${pairs})` : `[${pairs}]`
	}
}

// Shared

export interface PgPathConfig<T extends "tuple" | "xy" = "tuple" | "xy"> {
	mode?: T
}

/** @see https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-GEOMETRIC-PATHS */
export function path(): PgPathTuplesBuilderInitial<"">
/** @see https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-GEOMETRIC-PATHS */
export function path<TMode extends PgPathConfig["mode"] & {}>(
	config?: PgPathConfig<TMode>,
): Equal<TMode, "xy"> extends true
	? PgPathObjectsBuilderInitial<"">
	: PgPathTuplesBuilderInitial<"">
/** @see https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-GEOMETRIC-PATHS */
export function path<
	TName extends string,
	TMode extends PgPathConfig["mode"] & {},
>(
	name: TName,
	config?: PgPathConfig<TMode>,
): Equal<TMode, "xy"> extends true
	? PgPathObjectsBuilderInitial<TName>
	: PgPathTuplesBuilderInitial<TName>
export function path(a?: string | PgPathConfig, b?: PgPathConfig) {
	const { name, config } = getColumnNameAndConfig<PgPathConfig>(a, b)
	if (config?.mode === "xy") {
		return new PgPathObjectsBuilder(name) as PgPathObjectsBuilderInitial<string>
	}
	return new PgPathTuplesBuilder(name) as PgPathTuplesBuilderInitial<string>
}
