import { eq, or } from "drizzle-orm"
import { afterAll, beforeAll, expect, it } from "vitest"
import { boxTable } from "../../test/schema"
import {
	expectDataType,
	selectDataTypes,
} from "../../test/utils/select-data-types"
import { pgAttribute } from "../system-catalogs/pg-attribute"

let rowId: number
beforeAll(async () => {
	const [row] = await globalThis.db
		.insert(boxTable)
		.values({
			boxTuple: [
				[0, 1],
				[2, 3],
			],
			boxObject: [
				{ x: 0, y: 1 },
				{ x: 2, y: 3 },
			],
		})
		.returning({ id: boxTable.id })
	rowId = row.id
})
afterAll(async () => {
	await globalThis.db.delete(boxTable).where(eq(boxTable.id, rowId))
})

it("should store as box", async () => {
	const rows = await selectDataTypes(boxTable).where(
		or(
			eq(pgAttribute.attname, boxTable.boxTuple.name),
			eq(pgAttribute.attname, boxTable.boxObject.name),
		),
	)

	expectDataType(rows, boxTable.boxTuple.name, "box")
	expectDataType(rows, boxTable.boxObject.name, "box")
})

it("should return as tuple", async () => {
	const [row] = await globalThis.db
		.select({ boxTuple: boxTable.boxTuple })
		.from(boxTable)
		.where(eq(boxTable.id, rowId))

	// Re-ordered by Postgres to be top-right, bottom-left.
	expect(row.boxTuple).toEqual([
		[2, 3],
		[0, 1],
	])
})

it("should return as object", async () => {
	const [row] = await globalThis.db
		.select({ boxObject: boxTable.boxObject })
		.from(boxTable)
		.where(eq(boxTable.id, rowId))

	// Re-ordered by Postgres to be top-right, bottom-left.
	expect(row.boxObject).toEqual([
		{ x: 2, y: 3 },
		{ x: 0, y: 1 },
	])
})
