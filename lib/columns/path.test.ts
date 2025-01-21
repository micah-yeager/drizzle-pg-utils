import { eq, or } from "drizzle-orm"
import { afterAll, beforeAll, expect, it } from "vitest"
import { pathTable } from "../../test/schema"
import {
	expectDataType,
	selectDataTypes,
} from "../../test/utils/select-data-types"
import { pgAttribute } from "../system-catalogs/pg-attribute"

let rowId: number
beforeAll(async () => {
	const [row] = await globalThis.db
		.insert(pathTable)
		.values({
			closedPathTuple: {
				closed: true,
				points: [
					[0, 1],
					[2, 3],
					[4, 5],
				],
			},
			openPathTuple: {
				closed: false,
				points: [
					[0, 1],
					[2, 3],
					[4, 5],
				],
			},
			closedPathObject: {
				closed: true,
				points: [
					{ x: 0, y: 1 },
					{ x: 2, y: 3 },
					{ x: 4, y: 5 },
				],
			},
			openPathObject: {
				closed: false,
				points: [
					{ x: 0, y: 1 },
					{ x: 2, y: 3 },
					{ x: 4, y: 5 },
				],
			},
		})
		.returning({ id: pathTable.id })
	rowId = row.id
})
afterAll(async () => {
	await globalThis.db.delete(pathTable).where(eq(pathTable.id, rowId))
})

it("should store as box", async () => {
	const rows = await selectDataTypes(pathTable).where(
		or(
			eq(pgAttribute.attname, pathTable.closedPathTuple.name),
			eq(pgAttribute.attname, pathTable.openPathTuple.name),
			eq(pgAttribute.attname, pathTable.closedPathObject.name),
			eq(pgAttribute.attname, pathTable.openPathObject.name),
		),
	)

	expectDataType(rows, pathTable.closedPathTuple.name, "path")
	expectDataType(rows, pathTable.openPathTuple.name, "path")
	expectDataType(rows, pathTable.closedPathObject.name, "path")
	expectDataType(rows, pathTable.openPathObject.name, "path")
})

it("should return as closed tuple", async () => {
	const [row] = await globalThis.db
		.select({ closedPathTuple: pathTable.closedPathTuple })
		.from(pathTable)
		.where(eq(pathTable.id, rowId))

	expect(row.closedPathTuple).toEqual({
		closed: true,
		points: [
			[0, 1],
			[2, 3],
			[4, 5],
		],
	})
})

it("should return as open tuple", async () => {
	const [row] = await globalThis.db
		.select({ openPathTuple: pathTable.openPathTuple })
		.from(pathTable)
		.where(eq(pathTable.id, rowId))

	expect(row.openPathTuple).toEqual({
		closed: false,
		points: [
			[0, 1],
			[2, 3],
			[4, 5],
		],
	})
})

it("should return as closed object", async () => {
	const [row] = await globalThis.db
		.select({ closedPathObject: pathTable.closedPathObject })
		.from(pathTable)
		.where(eq(pathTable.id, rowId))

	// Re-ordered by Postgres to be top-right, bottom-left.
	expect(row.closedPathObject).toEqual({
		closed: true,
		points: [
			{ x: 0, y: 1 },
			{ x: 2, y: 3 },
			{ x: 4, y: 5 },
		],
	})
})

it("should return as open object", async () => {
	const [row] = await globalThis.db
		.select({ openPathObject: pathTable.openPathObject })
		.from(pathTable)
		.where(eq(pathTable.id, rowId))

	expect(row.openPathObject).toEqual({
		closed: false,
		points: [
			{ x: 0, y: 1 },
			{ x: 2, y: 3 },
			{ x: 4, y: 5 },
		],
	})
})
