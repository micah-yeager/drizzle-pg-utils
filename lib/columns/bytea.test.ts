import { eq } from "drizzle-orm"
import { afterAll, beforeAll, expect, it } from "vitest"
import { byteaTable } from "../../test/schema/binary"
import {
	expectDataType,
	selectDataTypes,
} from "../../test/utils/select-data-types"
import { pgAttribute } from "../system-catalogs/pg-attribute"

const value = Buffer.from("scooby-doobers")

let rowId: number
beforeAll(async () => {
	const [row] = await globalThis.db
		.insert(byteaTable)
		.values({ bytea: value })
		.returning({ id: byteaTable.id })
	rowId = row.id
})
afterAll(async () => {
	await globalThis.db.delete(byteaTable).where(eq(byteaTable.id, rowId))
})

it("should store as bytea", async () => {
	const rows = await selectDataTypes(byteaTable).where(
		eq(pgAttribute.attname, byteaTable.bytea.name),
	)

	expectDataType(rows, byteaTable.bytea.name, "bytea")
})

it("should return as buffer", async () => {
	const [row] = await globalThis.db
		.select({ bytea: byteaTable.bytea })
		.from(byteaTable)
		.where(eq(byteaTable.id, rowId))

	expect(row.bytea).toBeInstanceOf(Buffer)
})

it("should get without modification", async () => {
	const [row] = await globalThis.db
		.select({ bytea: byteaTable.bytea })
		.from(byteaTable)
		.where(eq(byteaTable.id, rowId))

	expect(row.bytea).toEqual(value)
})
