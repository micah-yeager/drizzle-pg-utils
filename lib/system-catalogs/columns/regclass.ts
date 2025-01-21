import { customType } from "drizzle-orm/pg-core"
import type { EmptyObject } from "type-fest"

export const regclass = customType<{
	data: string
	config: EmptyObject
}>({
	dataType() {
		return "regclass"
	},
})
