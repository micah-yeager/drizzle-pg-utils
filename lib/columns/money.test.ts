import { eq, sql } from "drizzle-orm"
import { afterAll, beforeAll, expect, it } from "vitest"
import { moneyTable } from "../../test/schema"
import {
	expectDataType,
	selectDataTypes,
} from "../../test/utils/select-data-types"
import { pgAttribute } from "../system-catalogs/pg-attribute"

const value = "10,000.24"

let rowId: number
beforeAll(async () => {
	const [row] = await globalThis.db
		.insert(moneyTable)
		.values({ money: value })
		.returning({ id: moneyTable.id })
	rowId = row.id
})
afterAll(async () => {
	await globalThis.db.delete(moneyTable).where(eq(moneyTable.id, rowId))
})

it("should store as money", async () => {
	const rows = await selectDataTypes(moneyTable).where(
		eq(pgAttribute.attname, moneyTable.money.name),
	)

	expectDataType(rows, moneyTable.money.name, "money")
})

it("should return as string", async () => {
	const [row] = await globalThis.db
		.select({ money: moneyTable.money })
		.from(moneyTable)
		.where(eq(sql`${rowId}`, moneyTable.id))

	expect(row.money).toBeTypeOf("string")
})
