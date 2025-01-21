import { eq, or } from "drizzle-orm"
import { afterAll, beforeAll, expect, it } from "vitest"
import { lsegTable } from "../../test/schema"
import {
	expectDataType,
	selectDataTypes,
} from "../../test/utils/select-data-types"
import { pgAttribute } from "../system-catalogs/pg-attribute"

let rowId: number
beforeAll(async () => {
	const [row] = await globalThis.db
		.insert(lsegTable)
		.values({
			lsegTuple: [
				[0, 1],
				[2, 3],
			],
			lsegObject: [
				{ x: 0, y: 1 },
				{ x: 2, y: 3 },
			],
		})
		.returning({ id: lsegTable.id })
	rowId = row.id
})
afterAll(async () => {
	await globalThis.db.delete(lsegTable).where(eq(lsegTable.id, rowId))
})

it("should store as lseg", async () => {
	const rows = await selectDataTypes(lsegTable).where(
		or(
			eq(pgAttribute.attname, lsegTable.lsegTuple.name),
			eq(pgAttribute.attname, lsegTable.lsegObject.name),
		),
	)

	expectDataType(rows, lsegTable.lsegTuple.name, "lseg")
	expectDataType(rows, lsegTable.lsegObject.name, "lseg")
})

it("should return as tuple", async () => {
	const [row] = await globalThis.db
		.select({ lsegTuple: lsegTable.lsegTuple })
		.from(lsegTable)
		.where(eq(lsegTable.id, rowId))

	expect(row.lsegTuple).toEqual([
		[0, 1],
		[2, 3],
	])
})

it("should return as object", async () => {
	const [row] = await globalThis.db
		.select({ lsegObject: lsegTable.lsegObject })
		.from(lsegTable)
		.where(eq(lsegTable.id, rowId))

	expect(row.lsegObject).toEqual([
		{ x: 0, y: 1 },
		{ x: 2, y: 3 },
	])
})
