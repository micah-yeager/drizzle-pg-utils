import type { TableLike } from "drizzle-orm/query-builders/select.types"

declare module "drizzle-orm" {
	/** @see https://github.com/drizzle-team/drizzle-orm/blob/49d2930126170087e472d98f6278fa2f3e8279d4/drizzle-orm/src/utils.ts#L234-L242 */
	function getColumnNameAndConfig<
		TConfig extends Record<string, any> | undefined,
	>(
		a: string | TConfig | undefined,
		b: TConfig | undefined,
	): { name: string; config: TConfig }

	/** @see https://github.com/drizzle-team/drizzle-orm/blob/49d2930126170087e472d98f6278fa2f3e8279d4/drizzle-orm/src/utils.ts#L196C1-L206C2 */
	function getTableLikeName(table: TableLike): string | undefined
}
