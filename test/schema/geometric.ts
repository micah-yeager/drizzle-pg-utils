import { pgTable, serial } from "drizzle-orm/pg-core"
import { box } from "../../lib/columns/box"
import { circle } from "../../lib/columns/circle"
import { lseg } from "../../lib/columns/lseg"
import { path } from "../../lib/columns/path"
import { polygon } from "../../lib/columns/polygon"

export const boxTable = pgTable("box_table", {
	id: serial().primaryKey(),
	boxTuple: box().notNull(),
	boxObject: box({ mode: "xy" }).notNull(),
})

export const circleTable = pgTable("circle_table", {
	id: serial().primaryKey(),
	circleTuple: circle().notNull(),
	circleObject: circle({ mode: "xy" }).notNull(),
})

export const lsegTable = pgTable("lseg_table", {
	id: serial().primaryKey(),
	lsegTuple: lseg().notNull(),
	lsegObject: lseg({ mode: "xy" }).notNull(),
})

export const pathTable = pgTable("path_table", {
	id: serial().primaryKey(),
	closedPathTuple: path().notNull(),
	openPathTuple: path().notNull(),
	closedPathObject: path({ mode: "xy" }).notNull(),
	openPathObject: path({ mode: "xy" }).notNull(),
})

export const polygonTable = pgTable("polygon_table", {
	id: serial().primaryKey(),
	polygonTuple: polygon().notNull(),
	polygonObject: polygon({ mode: "xy" }).notNull(),
})
