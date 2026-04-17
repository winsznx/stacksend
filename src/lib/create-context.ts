import { createContext, useContext } from 'react';

export function createStrictContext<T>(displayName: string) {
  const Context = createContext<T | undefined>(undefined);
  Context.displayName = displayName;

  function useStrictContext(): T {
    const value = useContext(Context);
    if (value === undefined) {
      throw new Error(`${displayName} context is undefined. Wrap component in a Provider.`);
    }
    return value;
  }

  return [Context, useStrictContext] as const;
}

export type {};
