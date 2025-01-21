import { customType } from "drizzle-orm/pg-core"
import type { EmptyObject } from "type-fest"

export const oid = customType<{
	data: number
	config: EmptyObject
}>({
	dataType() {
		return "oid"
	},
})
