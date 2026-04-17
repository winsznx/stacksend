export function trimAll<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    const value = result[key as keyof T];
    if (typeof value === 'string') {
      (result as Record<string, unknown>)[key] = value.trim();
    }
  }
  return result;
}

export function stripNullBytes(input: string): string {
  return input.replace(/\0/g, '');
}

export type {};
