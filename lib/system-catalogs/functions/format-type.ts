import { type SQL, type SQLWrapper, sql } from "drizzle-orm"

export function formatType(oid: SQLWrapper, typemod: SQLWrapper): SQL<string> {
	return sql`format_type(${oid}, ${typemod})`
}
