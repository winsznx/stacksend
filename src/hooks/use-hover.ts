import { useState, useCallback, useRef, useEffect } from 'react';

export function useHover<T extends HTMLElement = HTMLElement>(): [React.RefObject<T | null>, boolean] {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<T | null>(null);

  const enter = useCallback(() => setHovered(true), []);
  const leave = useCallback(() => setHovered(false), []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    node.addEventListener('mouseenter', enter);
    node.addEventListener('mouseleave', leave);
    return () => {
      node.removeEventListener('mouseenter', enter);
      node.removeEventListener('mouseleave', leave);
    };
  }, [enter, leave]);

  return [ref, hovered];
}

export type {};
