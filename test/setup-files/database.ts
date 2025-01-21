import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { beforeAll, inject } from "vitest"
import * as schema from "../schema"

declare global {
	var db: NodePgDatabase<typeof schema>
}

beforeAll(async () => {
	if (globalThis.db) return

	const connectionString = inject("dbUri")
	const pool = new Pool({ connectionString })
	globalThis.db = drizzle(pool, { logger: true, schema })
})
