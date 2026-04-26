export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  signal?: AbortSignal
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null;
  return function(this: any, ...args: Parameters<T>) {
    if (signal?.aborted) return;
    const later = () => {
      timeout = null;
      func.apply(this, args);
    };
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    signal?.addEventListener('abort', () => {
      if (timeout !== null) clearTimeout(timeout);
    });
  };
}

export type {};
