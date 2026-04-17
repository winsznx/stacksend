import { useRef, useEffect, useCallback } from 'react';

export function useMounted(): () => boolean {
  const mounted = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  return useCallback(() => mounted.current, []);
}

export type {};
