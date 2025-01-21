import { pgTable, serial } from "drizzle-orm/pg-core"
import { bytea } from "../../lib/columns/bytea"

export const byteaTable = pgTable("bytea_table", {
	id: serial().primaryKey(),
	bytea: bytea().notNull(),
})
