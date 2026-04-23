import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

export function useWindowSize(debounceDelay = 150): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    let timeoutId: number | undefined;
    
    const handler = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      }, debounceDelay);
    };
    
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('resize', handler);
      window.clearTimeout(timeoutId);
    };
  }, [debounceDelay]);

  return size;
}

export type {};
