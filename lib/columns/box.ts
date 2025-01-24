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

export type PgBoxTuplesBuilderInitial<TName extends string> =
	PgBoxTuplesBuilder<{
		name: TName
		dataType: "json"
		columnType: "PgBoxTuples"
		data: [OrdinateTuple, OrdinateTuple]
		driverParam: string
		enumValues: undefined
	}>

export class PgBoxTuplesBuilder<
	T extends ColumnBuilderBaseConfig<"json", "PgBoxTuples">,
> extends PgColumnBuilder<T> {
	static override readonly [entityKind]: string = "PgBoxTuplesBuilder"

	constructor(name: string) {
		super(name, "json", "PgBoxTuples")
	}

	/** @internal */
	build<TTableName extends string>(
		table: AnyPgTable<{ name: TTableName }>,
	): PgBoxTuples<MakeColumnConfig<T, TTableName>> {
		return new PgBoxTuples<MakeColumnConfig<T, TTableName>>(
			table,
			this.config as ColumnBuilderRuntimeConfig<any, any>,
		)
	}
}

export class PgBoxTuples<
	T extends ColumnBaseConfig<"json", "PgBoxTuples">,
> extends PgColumn<T> {
	static override readonly [entityKind]: string = "PgBoxTuples"

	getSQLType(): string {
		return "box"
	}

	override mapFromDriverValue(value: string): [OrdinateTuple, OrdinateTuple] {
		return parseOrdinatePairs(value, { limit: true })
	}

	override mapToDriverValue([[x1, y1], [x2, y2]]: [
		OrdinateTuple,
		OrdinateTuple,
	]): string {
		return `(${x1},${y1}),(${x2},${y2})`
	}
}

// Object

export type PgBoxObjectsBuilderInitial<TName extends string> =
	PgBoxObjectsBuilder<{
		name: TName
		dataType: "json"
		columnType: "PgBoxObjects"
		data: [OrdinateObject, OrdinateObject]
		driverParam: string
		enumValues: undefined
	}>

export class PgBoxObjectsBuilder<
	T extends ColumnBuilderBaseConfig<"json", "PgBoxObjects">,
> extends PgColumnBuilder<T> {
	static override readonly [entityKind]: string = "PgBoxObjectsBuilder"

	constructor(name: string) {
		super(name, "json", "PgBoxObjects")
	}

	/** @internal */
	build<TTableName extends string>(
		table: AnyPgTable<{ name: TTableName }>,
	): PgBoxObjects<MakeColumnConfig<T, TTableName>> {
		return new PgBoxObjects<MakeColumnConfig<T, TTableName>>(
			table,
			this.config as ColumnBuilderRuntimeConfig<any, any>,
		)
	}
}

export class PgBoxObjects<
	T extends ColumnBaseConfig<"json", "PgBoxObjects">,
> extends PgColumn<T> {
	static override readonly [entityKind]: string = "PgBoxObjects"

	getSQLType(): string {
		return "box"
	}

	override mapFromDriverValue(value: string): [OrdinateObject, OrdinateObject] {
		return parseOrdinatePairs(value, { xy: true, limit: true })
	}

	override mapToDriverValue([{ x: x1, y: y1 }, { x: x2, y: y2 }]: [
		OrdinateObject,
		OrdinateObject,
	]): string {
		return `(${x1},${y1}),(${x2},${y2})`
	}
}

// Shared

export interface PgBoxConfig<T extends "tuple" | "xy" = "tuple" | "xy"> {
	mode?: T
}

/** @see https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-GEOMETRIC-BOXES */
export function box(): PgBoxTuplesBuilderInitial<"">
/** @see https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-GEOMETRIC-BOXES */
export function box<TMode extends PgBoxConfig["mode"] & {}>(
	config?: PgBoxConfig<TMode>,
): Equal<TMode, "xy"> extends true
	? PgBoxObjectsBuilderInitial<"">
	: PgBoxTuplesBuilderInitial<"">
/** @see https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-GEOMETRIC-BOXES */
export function box<
	TName extends string,
	TMode extends PgBoxConfig["mode"] & {},
>(
	name: TName,
	config?: PgBoxConfig<TMode>,
): Equal<TMode, "xy"> extends true
	? PgBoxObjectsBuilderInitial<TName>
	: PgBoxTuplesBuilderInitial<TName>
export function box(a?: string | PgBoxConfig, b?: PgBoxConfig) {
	const { name, config } = getColumnNameAndConfig<PgBoxConfig>(a, b)
	if (config?.mode === "xy") {
		return new PgBoxObjectsBuilder(name) as PgBoxObjectsBuilderInitial<string>
	}
	return new PgBoxTuplesBuilder(name) as PgBoxTuplesBuilderInitial<string>
}
