import { useEffect } from 'react';

export function useKeyboardShortcut(
  keys: string[],
  callback: (event: KeyboardEvent) => void,
  options: { preventDefault?: boolean } = {}
): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMatch = keys.every(
        (key) =>
          (key.toLowerCase() === 'ctrl' && event.ctrlKey) ||
          (key.toLowerCase() === 'alt' && event.altKey) ||
          (key.toLowerCase() === 'shift' && event.shiftKey) ||
          (key.toLowerCase() === 'meta' && event.metaKey) ||
          event.key.toLowerCase() === key.toLowerCase()
      );

      if (isMatch) {
        if (options.preventDefault) event.preventDefault();
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys, callback, options.preventDefault]);
}

export type {};
