import { customType } from "drizzle-orm/pg-core"
import type { EmptyObject } from "type-fest"

/** @see https://www.postgresql.org/docs/current/datatype-textsearch.html#DATATYPE-TSVECTOR */
export const tsvector = customType<{
	data: string
	config: EmptyObject
}>({
	dataType() {
		return "tsvector"
	},
})
