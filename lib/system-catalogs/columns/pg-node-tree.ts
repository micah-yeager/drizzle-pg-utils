import { customType } from "drizzle-orm/pg-core"
import type { EmptyObject } from "type-fest"

export const pgNodeTree = customType<{
	data: string
	config: EmptyObject
}>({
	dataType() {
		return "pgNodeTree"
	},
})
