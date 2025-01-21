import { pgTable, serial } from "drizzle-orm/pg-core"
import { money } from "../../lib/columns/money"

export const moneyTable = pgTable("money_table", {
	id: serial().primaryKey(),
	money: money().notNull(),
})
