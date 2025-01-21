import { eq, or } from "drizzle-orm"
import { afterAll, beforeAll, expect, it } from "vitest"
import { circleTable } from "../../test/schema"
import {
	expectDataType,
	selectDataTypes,
} from "../../test/utils/select-data-types"
import { pgAttribute } from "../system-catalogs/pg-attribute"

let rowId: number
beforeAll(async () => {
	const [row] = await globalThis.db
		.insert(circleTable)
		.values({
			circleTuple: [[0, 1], 2],
			circleObject: { x: 0, y: 1, radius: 2 },
		})
		.returning({ id: circleTable.id })
	rowId = row.id
})
afterAll(async () => {
	await globalThis.db.delete(circleTable).where(eq(circleTable.id, rowId))
})

it("should store as circle", async () => {
	const rows = await selectDataTypes(circleTable).where(
		or(
			eq(pgAttribute.attname, circleTable.circleTuple.name),
			eq(pgAttribute.attname, circleTable.circleObject.name),
		),
	)

	expectDataType(rows, circleTable.circleTuple.name, "circle")
	expectDataType(rows, circleTable.circleObject.name, "circle")
})

it("should return as tuple", async () => {
	const [row] = await globalThis.db
		.select({ circleTuple: circleTable.circleTuple })
		.from(circleTable)
		.where(eq(circleTable.id, rowId))

	expect(row.circleTuple).toEqual([[0, 1], 2])
})

it("should return as object", async () => {
	const [row] = await globalThis.db
		.select({ circleObject: circleTable.circleObject })
		.from(circleTable)
		.where(eq(circleTable.id, rowId))

	expect(row.circleObject).toEqual({ x: 0, y: 1, radius: 2 })
})
