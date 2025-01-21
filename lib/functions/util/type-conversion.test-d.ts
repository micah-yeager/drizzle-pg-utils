import type { SQL } from "drizzle-orm"
import { describe, expectTypeOf, it } from "vitest"
import type { NormalizeInputs } from "./type-conversion"

describe("unknown types", () => {
	it("should return unknown for a single unknown", () => {
		expectTypeOf<NormalizeInputs<[SQL<unknown>]>>().toEqualTypeOf<unknown>()
	})

	it("should return unknown for multiple unknowns", () => {
		expectTypeOf<
			NormalizeInputs<[SQL<unknown>, SQL<unknown>]>
		>().toEqualTypeOf<unknown>()
	})

	it("should return unknown for an unknown with a primitive", () => {
		expectTypeOf<
			NormalizeInputs<[SQL<unknown>, SQL<string>]>
		>().toEqualTypeOf<unknown>()
	})

	it("should return unknown for an unknown with an object", () => {
		expectTypeOf<
			NormalizeInputs<[SQL<unknown>, SQL<{ test: 0 }>]>
		>().toEqualTypeOf<unknown>()
	})

	it("should return unknown for an unknown with an array", () => {
		expectTypeOf<
			NormalizeInputs<[SQL<unknown>, SQL<number[]>]>
		>().toEqualTypeOf<unknown>()
	})

	it("should return unknown for an unknown with a tuple", () => {
		expectTypeOf<
			NormalizeInputs<[SQL<unknown>, SQL<[1, 2, "a", "b"]>]>
		>().toEqualTypeOf<unknown>()
	})
})

describe("homogenous types", () => {
	it("should return the type for a single primitive", () => {
		expectTypeOf<NormalizeInputs<[SQL<number>]>>().toEqualTypeOf<number>()
	})

	it("should return the type for multiple matching primitives", () => {
		expectTypeOf<
			NormalizeInputs<[SQL<string>, SQL<string>]>
		>().toEqualTypeOf<string>()
	})

	it("should return the primitive type for literals", () => {
		expectTypeOf<
			NormalizeInputs<[SQL<"literal 1">, SQL<"literal 2">]>
		>().toEqualTypeOf<string>()
	})
})

describe("heterogeneous types", () => {
	it("should return never for differing primitives", () => {
		expectTypeOf<
			NormalizeInputs<[SQL<number>, SQL<string>]>
		>().toEqualTypeOf<never>()
	})

	it("should return never for a primitive with an array", () => {
		expectTypeOf<
			NormalizeInputs<[SQL<string[]>, SQL<string>]>
		>().toEqualTypeOf<never>()
	})

	it("should return never for a primitive with an object", () => {
		expectTypeOf<
			NormalizeInputs<[SQL<string>, SQL<{ test: 0 }>]>
		>().toEqualTypeOf<never>()
	})
})
