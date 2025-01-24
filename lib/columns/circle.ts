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
import type { OrdinateObject, OrdinateTuple } from "./utils/geometric"

export type CircleTuple = [OrdinateTuple, number]
export type CircleObject = OrdinateObject & { radius: number }

// Tuple

export type PgCircleTupleBuilderInitial<TName extends string> =
	PgCircleTupleBuilder<{
		name: TName
		dataType: "json"
		columnType: "PgCircleTuple"
		data: CircleTuple
		driverParam: string
		enumValues: undefined
	}>

export class PgCircleTupleBuilder<
	T extends ColumnBuilderBaseConfig<"json", "PgCircleTuple">,
> extends PgColumnBuilder<T> {
	static override readonly [entityKind]: string = "PgCircleTupleBuilder"

	constructor(name: string) {
		super(name, "json", "PgCircleTuple")
	}

	/** @internal */
	build<TTableName extends string>(
		table: AnyPgTable<{ name: TTableName }>,
	): PgCircleTuple<MakeColumnConfig<T, TTableName>> {
		return new PgCircleTuple<MakeColumnConfig<T, TTableName>>(
			table,
			this.config as ColumnBuilderRuntimeConfig<any, any>,
		)
	}
}

export class PgCircleTuple<
	T extends ColumnBaseConfig<"json", "PgCircleTuple">,
> extends PgColumn<T> {
	static override readonly [entityKind]: string = "PgCircleTuple"

	getSQLType(): string {
		return "circle"
	}

	override mapFromDriverValue(value: string | CircleObject): CircleTuple {
		if (typeof value === "string") {
			const [x, y, radius] = value.slice(1, -1).replace(/[()]/g, "").split(",")
			return [
				[Number.parseFloat(x), Number.parseFloat(y)],
				Number.parseFloat(radius),
			]
		}
		return [[value.x, value.y], value.radius]
	}

	override mapToDriverValue([[x, y], radius]: CircleTuple): string {
		return `<(${x},${y}),${radius}>`
	}
}

// Object

export type PgCircleObjectBuilderInitial<TName extends string> =
	PgCircleObjectBuilder<{
		name: TName
		dataType: "json"
		columnType: "PgCircleObject"
		data: CircleObject
		driverParam: string
		enumValues: undefined
	}>

export class PgCircleObjectBuilder<
	T extends ColumnBuilderBaseConfig<"json", "PgCircleObject">,
> extends PgColumnBuilder<T> {
	static override readonly [entityKind]: string = "PgCircleObjectBuilder"

	constructor(name: string) {
		super(name, "json", "PgCircleObject")
	}

	/** @internal */
	build<TTableName extends string>(
		table: AnyPgTable<{ name: TTableName }>,
	): PgCircleObject<MakeColumnConfig<T, TTableName>> {
		return new PgCircleObject<MakeColumnConfig<T, TTableName>>(
			table,
			this.config as ColumnBuilderRuntimeConfig<any, any>,
		)
	}
}

export class PgCircleObject<
	T extends ColumnBaseConfig<"json", "PgCircleObject">,
> extends PgColumn<T> {
	static override readonly [entityKind]: string = "PgCircleObject"

	getSQLType(): string {
		return "circle"
	}

	override mapFromDriverValue(value: string | CircleObject): CircleObject {
		if (typeof value === "string") {
			const [x, y, radius] = value.slice(1, -1).replace(/[()]/g, "").split(",")
			return {
				x: Number.parseFloat(x),
				y: Number.parseFloat(y),
				radius: Number.parseFloat(radius),
			}
		}
		return value
	}

	override mapToDriverValue({ x, y, radius }: CircleObject): string {
		return `<(${x},${y}),${radius}>`
	}
}

// Shared

export interface PgCircleConfig<T extends "tuple" | "xy" = "tuple" | "xy"> {
	mode?: T
}

/** @see https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-CIRCLE */
export function circle(): PgCircleTupleBuilderInitial<"">
/** @see https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-CIRCLE */
export function circle<TMode extends PgCircleConfig["mode"] & {}>(
	config?: PgCircleConfig<TMode>,
): Equal<TMode, "xy"> extends true
	? PgCircleObjectBuilderInitial<"">
	: PgCircleTupleBuilderInitial<"">
/** @see https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-CIRCLE */
export function circle<
	TName extends string,
	TMode extends PgCircleConfig["mode"] & {},
>(
	name: TName,
	config?: PgCircleConfig<TMode>,
): Equal<TMode, "xy"> extends true
	? PgCircleObjectBuilderInitial<TName>
	: PgCircleTupleBuilderInitial<TName>
export function circle(a?: string | PgCircleConfig, b?: PgCircleConfig) {
	const { name, config } = getColumnNameAndConfig<PgCircleConfig>(a, b)
	if (config?.mode === "xy") {
		return new PgCircleObjectBuilder(
			name,
		) as PgCircleObjectBuilderInitial<string>
	}
	return new PgCircleTupleBuilder(name) as PgCircleTupleBuilderInitial<string>
}
