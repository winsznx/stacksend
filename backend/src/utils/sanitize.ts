/**
 * Trims whitespace from all string values in an object.
 * Creates a shallow copy of the object before trimming.
 * 
 * @param obj - The object containing string values to trim
 * @returns A new object with trimmed string values
 */
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

/**
 * Removes null bytes (\0) from a string to prevent injection attacks.
 * 
 * @param input - The string to sanitize
 * @returns The sanitized string without null bytes
 */
export function stripNullBytes(input: string): string {
  return input.replace(/\0/g, '');
}

export type {};
