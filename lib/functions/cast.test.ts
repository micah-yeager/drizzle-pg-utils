import { sql } from "drizzle-orm"
import { integer, pgTable } from "drizzle-orm/pg-core"
import { describe, it } from "vitest"
import type { CompareSqlCase } from "../../test/utils/compare-sql-values"
import { compareSQLValues } from "../../test/utils/compare-sql-values"
import { circle } from "../columns/circle"
import { money } from "../columns/money"
import { pgTypeof } from "../system-catalogs/functions/pg-typeof"
import { cast } from "./cast"

type TestCase = CompareSqlCase & { castName: string }

describe("column builder function", () => {
	it.each([
		{
			castName: "built-in type",
			input: pgTypeof(cast(sql`'1'`, integer)),
			expected: sql`'integer'::regtype`,
		},
		{
			castName: "custom type from `customType()`",
			input: pgTypeof(cast(sql`'1000.24'`, money)),
			expected: sql`'money'::regtype`,
		},
		{
			castName: "custom type from `PgColumnBuilder`",
			input: pgTypeof(cast(sql`'<(0,1),2>'`, circle)),
			expected: sql`'circle'::regtype`,
		},
	] satisfies TestCase[])("should cast to $castName", compareSQLValues)
})

describe("column builder", () => {
	it.each([
		{
			castName: "built-in type",
			input: pgTypeof(cast(sql`'1'`, integer())),
			expected: sql`'integer'::regtype`,
		},
		{
			castName: "custom type from `customType()`",
			input: pgTypeof(cast(sql`'1000.24'`, money())),
			expected: sql`'money'::regtype`,
		},
		{
			castName: "custom type from `PgColumnBuilder`",
			input: pgTypeof(cast(sql`'<(0,1),2>'`, circle())),
			expected: sql`'circle'::regtype`,
		},
		{
			castName: "array type",
			input: pgTypeof(cast(sql`array[1,2,3]`, integer().array())),
			expected: sql`'integer[]'::regtype`,
		},
	] satisfies TestCase[])("should cast to $castName", compareSQLValues)
})

describe("table column", () => {
	const table = pgTable("", {
		builtIn: integer(),
		customType: money(),
		columnBuilder: circle(),
		array: integer().array(),
	})

	it.each([
		{
			castName: "built-in type",
			input: pgTypeof(cast(sql`'1'`, table.builtIn)),
			expected: sql`'integer'::regtype`,
		},
		{
			castName: "custom type from `customType()`",
			input: pgTypeof(cast(sql`'1000.24'`, table.customType)),
			expected: sql`'money'::regtype`,
		},
		{
			castName: "custom type from `PgColumnBuilder`",
			input: pgTypeof(cast(sql`'<(0,1),2>'`, table.columnBuilder)),
			expected: sql`'circle'::regtype`,
		},
		{
			castName: "array type",
			input: pgTypeof(cast(sql`array[1,2,3]`, table.array)),
			expected: sql`'integer[]'::regtype`,
		},
	] satisfies TestCase[])("should cast to $castName", compareSQLValues)
})

describe("string", () => {
	it.each([
		{
			castName: "built-in type",
			input: pgTypeof(cast(sql`'1'`, "integer")),
			expected: sql`'integer'::regtype`,
		},
		{
			castName: "custom type from `customType()`",
			input: pgTypeof(cast(sql`'1000.24'`, "money")),
			expected: sql`'money'::regtype`,
		},
		{
			castName: "custom type from `PgColumnBuilder`",
			input: pgTypeof(cast(sql`'<(0,1),2>'`, "circle")),
			expected: sql`'circle'::regtype`,
		},
		{
			castName: "array type",
			input: pgTypeof(cast(sql`array[1,2,3]`, "integer[]")),
			expected: sql`'integer[]'::regtype`,
		},
	] satisfies TestCase[])("should cast to $castName", compareSQLValues)
})
