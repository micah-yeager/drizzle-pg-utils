import { expect, it } from "vitest"
import { pgClass } from "../../lib/system-catalogs/pg-class"
import { bpcharTable } from "../schema"
import { selectDataTypes } from "./select-data-types"

it("should allow table as input", async () => {
	await expect(selectDataTypes(bpcharTable)).resolves.toMatchSnapshot()
})

it("should allow view as input", async () => {
	await expect(selectDataTypes(pgClass)).resolves.toMatchSnapshot()
})
