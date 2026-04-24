export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'));
    }

    const timeoutId = setTimeout(() => {
      signal?.removeEventListener('abort', abortHandler);
      resolve();
    }, ms);

    const abortHandler = () => {
      clearTimeout(timeoutId);
      reject(new DOMException('Aborted', 'AbortError'));
    };

    signal?.addEventListener('abort', abortHandler);
  });
}

export type {};
