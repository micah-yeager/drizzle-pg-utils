import { customType } from "drizzle-orm/pg-core"
import type { EmptyObject } from "type-fest"

export const xid = customType<{
	data: number
	driverData: string
	config: EmptyObject
}>({
	dataType() {
		return "xid"
	},
	toDriver(value) {
		return String(value)
	},
	fromDriver(value) {
		return Number(value)
	},
})
