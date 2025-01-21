import { boolean, char, integer, pgView, real, text } from "drizzle-orm/pg-core"
import { aclitem } from "./columns/aclitem"
import { name } from "./columns/name"
import { oid } from "./columns/oid"
import { pgNodeTree } from "./columns/pg-node-tree"
import { xid } from "./columns/xid"

/** @see https://www.postgresql.org/docs/current/catalog-pg-class.html */
export const pgClass = pgView("pg_class", {
	oid: oid().notNull(),
	relname: name().notNull(),
	relnamespace: oid().notNull(),
	reltype: oid().notNull(),
	reloftype: oid().notNull(),
	relowner: oid().notNull(),
	relam: oid().notNull(),
	relfilenode: oid().notNull(),
	reltablespace: oid().notNull(),
	relpages: integer().notNull(),
	reltuples: real().notNull(),
	relallvisible: integer().notNull(),
	reltoastrelid: oid().notNull(),
	relhasindex: boolean().notNull(),
	relisshared: boolean().notNull(),
	relpersistence: char().notNull(),
	relkind: char().notNull(),
	relnatts: integer().notNull(),
	relchecks: integer().notNull(),
	relhasrules: boolean().notNull(),
	relhastriggers: boolean().notNull(),
	relhassubclass: boolean().notNull(),
	relrowsecurity: boolean().notNull(),
	relforcerowsecurity: boolean().notNull(),
	relispopulated: boolean().notNull(),
	relreplident: char().notNull(),
	relispartition: boolean().notNull(),
	relrewrite: oid().notNull(),
	relfrozenxid: xid().notNull(),
	relminmxid: xid().notNull(),
	relacl: aclitem().array(),
	reloptions: text().array(),
	relpartbound: pgNodeTree(),
}).existing()
