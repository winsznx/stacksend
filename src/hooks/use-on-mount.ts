import { useEffect, useRef } from 'react';

export function useOnMount(callback: () => void): void {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      callback();
      isMounted.current = true;
    }
  }, [callback]);
}

export type {};
