import { customType } from "drizzle-orm/pg-core"
import type { EmptyObject } from "type-fest"

/** @see https://www.postgresql.org/docs/current/datatype-textsearch.html#DATATYPE-TSQUERY */
export const tsquery = customType<{
	data: string
	config: EmptyObject
}>({
	dataType() {
		return "tsquery"
	},
})
