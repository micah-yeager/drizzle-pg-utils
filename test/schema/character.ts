import { pgTable, serial } from "drizzle-orm/pg-core"
import { bpchar } from "../../lib/columns/bpchar"

export const bpcharTable = pgTable("bpchar_table", {
	id: serial().primaryKey(),
	bpchar: bpchar().notNull(),
})
