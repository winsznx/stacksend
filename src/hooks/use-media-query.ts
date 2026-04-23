import { useState, useEffect } from 'react';

export function useMediaQuery(query: string, serverFallback = false): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return serverFallback;
  });

  useEffect(() => {
    const matchMedia = window.matchMedia(query);
    
    // Update immediately if the query result changed since initial render
    if (matchMedia.matches !== matches) {
      setMatches(matchMedia.matches);
    }

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    if (matchMedia.addEventListener) {
      matchMedia.addEventListener('change', handleChange);
      return () => matchMedia.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers like Safari < 14
      matchMedia.addListener(handleChange);
      return () => matchMedia.removeListener(handleChange);
    }
  }, [query, matches]);

  return matches;
}

export type {};
