export const noop = <T = void>(...args: unknown[]): T => (undefined as unknown as T);

export const EMPTY_ARRAY: readonly [] = Object.freeze([]) as readonly [];
export const EMPTY_OBJECT: Readonly<Record<string, never>> = Object.freeze({});

export type {};
