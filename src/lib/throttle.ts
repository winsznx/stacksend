export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number,
  signal?: AbortSignal
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function(this: any, ...args: Parameters<T>) {
    if (signal?.aborted) return;
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      const timeoutId = setTimeout(() => (inThrottle = false), limit);
      signal?.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        inThrottle = false;
      });
    }
  };
}

export type {};
