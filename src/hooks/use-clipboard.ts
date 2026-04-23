import { useState, useCallback } from 'react';

export function useClipboard(timeout = 2000): { copied: boolean; copy: (text: string) => Promise<boolean>; error: Error | null } {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      setError(new Error('Clipboard API not supported'));
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(null);
      
      setTimeout(() => setCopied(false), timeout);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to copy'));
      setCopied(false);
      return false;
    }
  }, [timeout]);

  return { copied, copy, error };
}

export type {};
