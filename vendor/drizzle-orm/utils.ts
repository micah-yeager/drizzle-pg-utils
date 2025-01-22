/** @see https://github.com/drizzle-team/drizzle-orm/blob/49d2930126170087e472d98f6278fa2f3e8279d4/drizzle-orm/src/utils.ts#L234-L242 */
export function getColumnNameAndConfig<
	TConfig extends Record<string, any> | undefined,
>(a: string | TConfig | undefined, b: TConfig | undefined) {
	return {
		name: typeof a === "string" && a.length > 0 ? a : ("" as string),
		config: typeof a === "object" ? a : (b as TConfig),
	}
}
