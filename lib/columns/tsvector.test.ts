import { eq } from "drizzle-orm"
import { tsvectorTable } from "test/schema/text-search"
import { afterAll, beforeAll, expect, it } from "vitest"
import {
	expectDataType,
	selectDataTypes,
} from "../../test/utils/select-data-types"
import { toTsvector } from "../functions/text-search/to-tsvector"
import { pgAttribute } from "../system-catalogs/pg-attribute"

let rowId: number
beforeAll(async () => {
	const [row] = await globalThis.db
		.insert(tsvectorTable)
		.values({ tsvector: toTsvector("what are the haps") })
		.returning({ id: tsvectorTable.id })
	rowId = row.id
})
afterAll(async () => {
	await globalThis.db.delete(tsvectorTable).where(eq(tsvectorTable.id, rowId))
})

it("should store as tsvector", async () => {
	const rows = await selectDataTypes(tsvectorTable).where(
		eq(pgAttribute.attname, tsvectorTable.tsvector.name),
	)

	expectDataType(rows, tsvectorTable.tsvector.name, "tsvector")
})

it("should return as string", async () => {
	const [row] = await globalThis.db
		.select({ tsvector: tsvectorTable.tsvector })
		.from(tsvectorTable)
		.where(eq(tsvectorTable.id, rowId))

	expect(row.tsvector).toBeTypeOf("string")
})
