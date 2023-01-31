/**
 * ENUM Utility Type
 *
 * Usage:
 *
 * const EXAMPLE {
 *  EXAMPLE_TYPE: "EXAMPLE_TYPE"
 * } as const;
 *
 * const Example = ObjectValues<typeof EXAMPLE>;
 */
export type ObjectValues<T> = T[keyof T];
