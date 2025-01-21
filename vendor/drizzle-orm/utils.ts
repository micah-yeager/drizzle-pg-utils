export function getColumnNameAndConfig<
	TConfig extends Record<string, any> | undefined,
>(a: string | TConfig | undefined, b: TConfig | undefined) {
	return {
		name: typeof a === "string" && a.length > 0 ? a : ("" as string),
		config: typeof a === "object" ? a : (b as TConfig),
	}
}
