export class PgUtilError extends Error {
	constructor(message: string) {
		super(message)
		this.name = "PgUtilError"
	}
}
