import { eq } from "drizzle-orm"
import { afterAll, beforeAll, expect, it } from "vitest"
import { bpcharTable } from "../../test/schema"
import {
	expectDataType,
	selectDataTypes,
} from "../../test/utils/select-data-types"
import { pgAttribute } from "../system-catalogs/pg-attribute"

const trimmedValue = "what are the haps"
const valueWithTrailing = `${trimmedValue}   `

let rowId: number
beforeAll(async () => {
	const [row] = await globalThis.db
		.insert(bpcharTable)
		.values({ bpchar: valueWithTrailing })
		.returning({ id: bpcharTable.id })
	rowId = row.id
})
afterAll(async () => {
	await globalThis.db.delete(bpcharTable).where(eq(bpcharTable.id, rowId))
})

it("should store as bpchar", async () => {
	const rows = await selectDataTypes(bpcharTable).where(
		eq(pgAttribute.attname, bpcharTable.bpchar.name),
	)

	expectDataType(rows, bpcharTable.bpchar.name, "bpchar")
})

it("should return as string", async () => {
	const [row] = await globalThis.db
		.select({ bpchar: bpcharTable.bpchar })
		.from(bpcharTable)
		.where(eq(bpcharTable.id, rowId))

	expect(row.bpchar).toBeTypeOf("string")
})
