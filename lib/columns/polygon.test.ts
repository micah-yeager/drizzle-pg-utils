import { eq, or } from "drizzle-orm"
import { afterAll, beforeAll, expect, it } from "vitest"
import { polygonTable } from "../../test/schema"
import {
	expectDataType,
	selectDataTypes,
} from "../../test/utils/select-data-types"
import { pgAttribute } from "../system-catalogs/pg-attribute"

let rowId: number
beforeAll(async () => {
	const [row] = await globalThis.db
		.insert(polygonTable)
		.values({
			polygonTuple: [
				[0, 1],
				[2, 3],
				[4, 5],
			],
			polygonObject: [
				{ x: 0, y: 1 },
				{ x: 2, y: 3 },
				{ x: 4, y: 5 },
			],
		})
		.returning({ id: polygonTable.id })
	rowId = row.id
})
afterAll(async () => {
	await globalThis.db.delete(polygonTable).where(eq(polygonTable.id, rowId))
})

it("should store as polygon", async () => {
	const rows = await selectDataTypes(polygonTable).where(
		or(
			eq(pgAttribute.attname, polygonTable.polygonTuple.name),
			eq(pgAttribute.attname, polygonTable.polygonObject.name),
		),
	)

	expectDataType(rows, polygonTable.polygonTuple.name, "polygon")
	expectDataType(rows, polygonTable.polygonObject.name, "polygon")
})

it("should return as tuple", async () => {
	const [row] = await globalThis.db
		.select({ polygonTuple: polygonTable.polygonTuple })
		.from(polygonTable)
		.where(eq(polygonTable.id, rowId))

	expect(row.polygonTuple).toEqual([
		[0, 1],
		[2, 3],
		[4, 5],
	])
})

it("should return as object", async () => {
	const [row] = await globalThis.db
		.select({ polygonObject: polygonTable.polygonObject })
		.from(polygonTable)
		.where(eq(polygonTable.id, rowId))

	expect(row.polygonObject).toEqual([
		{ x: 0, y: 1 },
		{ x: 2, y: 3 },
		{ x: 4, y: 5 },
	])
})
