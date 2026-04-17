export function throttle<T extends (...args: Parameters<T>) => void>(
  fn: T,
  interval: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let pending: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = interval - (now - lastCall);
    if (remaining <= 0) {
      if (pending) { clearTimeout(pending); pending = null; }
      lastCall = now;
      fn(...args);
    } else if (!pending) {
      pending = setTimeout(() => {
        lastCall = Date.now();
        pending = null;
        fn(...args);
      }, remaining);
    }
  };
}

export type {};
