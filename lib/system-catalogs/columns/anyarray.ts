import { customType } from "drizzle-orm/pg-core"
import type { EmptyObject } from "type-fest"

export const anyarray = customType<{
	data: unknown[]
	config: EmptyObject
}>({
	dataType() {
		return "anyarray"
	},
})
