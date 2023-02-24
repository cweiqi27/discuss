/**
 * ENUM Utility Type
 *
 * Usage:
 *
 * const EXAMPLE = {
 *  EXAMPLE_TYPE: "EXAMPLE_TYPE"
 * } as const;
 *
 * type ObjectValues<T> = T[keyof T];
 *
 * type Example = ObjectValues<typeof EXAMPLE>;
 */
export type ObjectValues<T> = T[keyof T];
