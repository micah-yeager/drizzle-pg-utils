import type { RestrictedColumn } from "../../../util"

/**
 * A typed, text-based JSON column.
 *
 * @see https://www.postgresql.org/docs/current/datatype-json.html#DATATYPE-JSON
 */
export type TextJsonColumn<TType> = RestrictedColumn<TType, "json", "PgJson">

/**
 * A typed, binary-based JSON column.
 *
 * @see https://www.postgresql.org/docs/current/datatype-json.html#DATATYPE-JSON
 */
export type BinaryJsonColumn<TType> = RestrictedColumn<TType, "json", "PgJsonb">

/**
 * A typed text- or binary-based JSON column.
 *
 * @see https://www.postgresql.org/docs/current/datatype-json.html#DATATYPE-JSON
 */
export type JsonColumn<TType> = TextJsonColumn<TType> | BinaryJsonColumn<TType>
