import { customType } from "drizzle-orm/pg-core"
import type { EmptyObject } from "type-fest"

export const name = customType<{
	data: string
	config: EmptyObject
}>({
	dataType() {
		return "name"
	},
})
