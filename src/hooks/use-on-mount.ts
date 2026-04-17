import { useEffect } from 'react';

// eslint-disable-next-line react-hooks/exhaustive-deps
export function useOnMount(callback: () => void | (() => void)): void {
  useEffect(callback, []);
}

export type {};
