import { eq } from "drizzle-orm"
import { tsqueryTable } from "test/schema/text-search"
import { afterAll, beforeAll, expect, it } from "vitest"
import {
	expectDataType,
	selectDataTypes,
} from "../../test/utils/select-data-types"
import { toTsquery } from "../functions/text-search/to-tsquery"
import { pgAttribute } from "../system-catalogs/pg-attribute"

let rowId: number
beforeAll(async () => {
	const [row] = await globalThis.db
		.insert(tsqueryTable)
		.values({ tsquery: toTsquery("what & are & the & haps") })
		.returning({ id: tsqueryTable.id })
	rowId = row.id
})
afterAll(async () => {
	await globalThis.db.delete(tsqueryTable).where(eq(tsqueryTable.id, rowId))
})

it("should store as tsquery", async () => {
	const rows = await selectDataTypes(tsqueryTable).where(
		eq(pgAttribute.attname, tsqueryTable.tsquery.name),
	)

	expectDataType(rows, tsqueryTable.tsquery.name, "tsquery")
})

it("should return as string", async () => {
	const [row] = await globalThis.db
		.select({ tsquery: tsqueryTable.tsquery })
		.from(tsqueryTable)
		.where(eq(tsqueryTable.id, rowId))

	expect(row.tsquery).toBeTypeOf("string")
})
