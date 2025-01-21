import { customType } from "drizzle-orm/pg-core"
import type { EmptyObject } from "type-fest"

/** @see https://www.postgresql.org/docs/current/datatype-money.html */
export const money = customType<{
	data: string
	config: EmptyObject
}>({
	dataType() {
		return "money"
	},
})
