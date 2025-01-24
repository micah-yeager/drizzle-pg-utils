import type { MakeColumnConfig } from "drizzle-orm/column-builder"
import type { AnyPgTable, PgColumn } from "drizzle-orm/pg-core"

/** @internal */
declare module "drizzle-orm/pg-core" {
	interface PgColumnBuilder {
		build<TTableName extends string>(
			table: AnyPgTable<{ name: TTableName }>,
		): PgColumn<MakeColumnConfig<any, TTableName>>
	}
}
