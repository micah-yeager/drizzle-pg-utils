export type OrdinateTuple = [number, number]
export type OrdinateObject = { x: number; y: number }

type ParsedOrdinatePairs<
	T extends OrdinateTuple | OrdinateObject,
	TLimit extends boolean | undefined,
> = TLimit extends true ? [T, T] : [T, T, ...T[]]

/**
 * Parses a string containing multiple ordinates.
 *
 * @example
 *
 * ```ts
 * parseOrdinatePairs("(0,1),(2,3)") // [[ 0, 1 ], [ 2, 3 ]]
 * ```
 *
 * @param raw - The string to parse.
 * @param options - Options for parsing output.
 * @throws {@link OrdinateParseError}
 */
export function parseOrdinatePairs<
	Txy extends boolean | undefined,
	TLimit extends boolean | undefined,
	TReturn extends ParsedOrdinatePairs<
		Txy extends true ? OrdinateObject : OrdinateTuple,
		TLimit
	>,
>(raw: string, options: { xy?: Txy; limit?: TLimit } = {}): TReturn {
	const rawPairs = raw.split("),(")
	const pairs = rawPairs.map((value, index) => {
		let pair = value
		// Remove leading parenthesis.
		if (index === 0) pair = pair.slice(1)
		// Remove trailing parenthesis.
		if (index === rawPairs.length - 1) pair = pair.slice(0, -1)

		const [x, y] = pair.split(",").map((value) => Number.parseFloat(value))
		return [x, y]
	})

	if (pairs.length < 2) throw new OrdinateParseError("Too few ordinate pairs")
	if (options.limit && pairs.length > 2) {
		throw new OrdinateParseError("Too many ordinate pairs")
	}
	if (options.xy) {
		return pairs.map(([x, y]) => ({ x, y })) as TReturn
	}
	return pairs as TReturn
}

/** Error thrown while executing {@link parseOrdinatePairs}. */
export class OrdinateParseError extends Error {
	constructor(message: string) {
		super(message)
		this.name += ":OrdinateParseError"
	}
}
