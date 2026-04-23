import { useEffect, useRef } from 'react';

export function useDocumentTitle(title: string, restoreOnUnmount = true): void {
  const originalTitle = useRef(typeof document !== 'undefined' ? document.title : '');

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    if (!restoreOnUnmount) return;
    return () => {
      document.title = originalTitle.current;
    };
  }, [restoreOnUnmount]);
}

export type {};
