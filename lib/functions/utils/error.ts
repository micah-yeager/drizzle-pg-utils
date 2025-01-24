import { PgUtilError } from "../../utils/error"

/**
 * General error occurring while generating SQL functions. All function errors
 * will inherit from this.
 *
 * @see {@link PgUtilError}
 */
export class PgUtilFunctionError extends PgUtilError {
	constructor(message: string) {
		super(message)
		this.name += "Function"
	}
}
