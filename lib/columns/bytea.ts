import { customType } from "drizzle-orm/pg-core"
import type { EmptyObject } from "type-fest"

/** @see https://www.postgresql.org/docs/current/datatype-binary.html */
export const bytea = customType<{
	data: Buffer
	config: EmptyObject
}>({
	dataType() {
		return "bytea"
	},
})
