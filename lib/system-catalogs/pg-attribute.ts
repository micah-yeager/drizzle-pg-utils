import { boolean, char, integer, pgView, text } from "drizzle-orm/pg-core"
import { aclitem } from "./columns/aclitem"
import { anyarray } from "./columns/anyarray"
import { name } from "./columns/name"
import { oid } from "./columns/oid"

/** @see https://www.postgresql.org/docs/current/catalog-pg-attribute.html */
export const pgAttribute = pgView("pg_attribute", {
	attrelid: oid().notNull(),
	attname: name().notNull(),
	atttypid: oid().notNull(),
	attlen: integer().notNull(),
	attnum: integer().notNull(),
	attcacheoff: integer().notNull(),
	atttypmod: integer().notNull(),
	attndims: integer().notNull(),
	attbyval: boolean().notNull(),
	attalign: char().notNull(),
	attstorage: char().notNull(),
	attcompression: char().notNull(),
	attnotnull: boolean().notNull(),
	atthasdef: boolean().notNull(),
	atthasmissing: boolean().notNull(),
	attidentity: char().notNull(),
	attgenerated: char().notNull(),
	attisdropped: boolean().notNull(),
	attislocal: boolean().notNull(),
	attinhcount: integer().notNull(),
	attcollation: oid().notNull(),
	attstattarget: integer(),
	attacl: aclitem().array(),
	attoptions: text().array(),
	attfdwoptions: text().array(),
	attmissingval: anyarray(),
}).existing()
