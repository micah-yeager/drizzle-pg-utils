/**
 * General error for `drizzle-pg-utils`. All other package errors inherit from
 * this.
 */
export class PgUtilError extends Error {
	constructor(message: string) {
		super(message)
		this.name = "PgUtilError"
	}
}
