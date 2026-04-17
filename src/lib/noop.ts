export function noop(): void {}

export const EMPTY_ARRAY: readonly [] = Object.freeze([]) as readonly [];
export const EMPTY_OBJECT: Readonly<Record<string, never>> = Object.freeze({});

export type {};
