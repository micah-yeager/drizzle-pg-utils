import { customType } from "drizzle-orm/pg-core"

/** @see https://www.postgresql.org/docs/current/datatype-character.html */
export const bpchar = customType<{
	data: string
	config: { length: number }
}>({
	dataType(config) {
		return config?.length === undefined ? "bpchar" : `bpchar(${config.length})`
	},
})
