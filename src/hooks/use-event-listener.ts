import { useEffect, useRef } from 'react';

export function useEventListener<K extends keyof WindowEventMap>(
  event: K,
  handler: (e: WindowEventMap[K]) => void,
  element?: undefined,
): void;
export function useEventListener<K extends keyof HTMLElementEventMap>(
  event: K,
  handler: (e: HTMLElementEventMap[K]) => void,
  element: React.RefObject<HTMLElement | null>,
): void;
export function useEventListener(
  event: string,
  handler: (e: Event) => void,
  element?: React.RefObject<HTMLElement | null>,
): void {
  const savedHandler = useRef(handler);
  useEffect(() => { savedHandler.current = handler; }, [handler]);

  useEffect(() => {
    const target = element?.current ?? window;
    const listener = (e: Event) => savedHandler.current(e);
    target.addEventListener(event, listener);
    return () => target.removeEventListener(event, listener);
  }, [event, element]);
}

export type {};
