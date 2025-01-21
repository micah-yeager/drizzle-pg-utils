// noinspection JSUnusedGlobalSymbols: imported and run by Vitest.

import type { StartedPostgreSqlContainer } from "@testcontainers/postgresql"
import { PostgreSqlContainer } from "@testcontainers/postgresql"
import { pushSchema } from "drizzle-kit/api"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import type { TestProject } from "vitest/node"
import * as schema from "../schema"

declare module "vitest" {
	export interface ProvidedContext {
		dbUri: string
	}
}

let dbIntegration: StartedPostgreSqlContainer

export async function setup({ provide }: TestProject) {
	dbIntegration = await new PostgreSqlContainer("postgres:16-alpine").start()
	const connectionString = dbIntegration.getConnectionUri()
	provide("dbUri", connectionString)

	const pool = new Pool({ connectionString })
	const { apply } = await pushSchema(schema, drizzle(pool))
	await apply()
}

export async function teardown() {
	await dbIntegration.stop()
}
