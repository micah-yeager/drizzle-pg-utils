import { sql } from "drizzle-orm"
import { integer, numeric, text } from "drizzle-orm/pg-core"
import { it } from "vitest"
import type { CompareSqlCase } from "../../test/utils/compare-sql-values"
import { compareSQLValues } from "../../test/utils/compare-sql-values"
import { money } from "../columns/money"
import { pgTypeof } from "../system-catalogs/functions/pg-typeof"
import { cast } from "./cast"

type TestCase = CompareSqlCase & { castName: string }

it.each([
	{
		castName: "text from integer",
		input: pgTypeof(cast(sql`1`, text)),
		expected: sql`'text'::regtype`,
	},
	{
		castName: "integer from text",
		input: pgTypeof(cast(sql`'1'`, integer)),
		expected: sql`'integer'::regtype`,
	},
	{
		castName: "text to money",
		input: pgTypeof(cast(sql`'1000.24'`, money)),
		expected: sql`'money'::regtype`,
	},
	{
		castName: "money to numeric",
		input: pgTypeof(cast(sql`'1000.24'::money`, numeric)),
		expected: sql`'numeric'::regtype`,
	},
] satisfies TestCase[])("should cast to $castName", compareSQLValues)
