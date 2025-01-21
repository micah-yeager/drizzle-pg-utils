import { pgTable, serial } from "drizzle-orm/pg-core"
import { tsquery } from "../../lib/columns/tsquery"
import { tsvector } from "../../lib/columns/tsvector"

export const tsvectorTable = pgTable("tsvector_table", {
	id: serial().primaryKey(),
	tsvector: tsvector().notNull(),
})

export const tsqueryTable = pgTable("tsquery_table", {
	id: serial().primaryKey(),
	tsquery: tsquery().notNull(),
})
