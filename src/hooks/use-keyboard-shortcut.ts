import { useEffect } from 'react';

interface ShortcutOptions {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  meta?: boolean;
}

export function useKeyboardShortcut(opts: ShortcutOptions, handler: () => void): void {
  const { key, ctrl, shift, meta } = opts;

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (ctrl && !e.ctrlKey) return;
      if (shift && !e.shiftKey) return;
      if (meta && !e.metaKey) return;
      if (e.key.toLowerCase() !== key.toLowerCase()) return;
      e.preventDefault();
      handler();
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [key, ctrl, shift, meta, handler]);
}

export type {};
