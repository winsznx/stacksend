import { useEffect, useRef, RefObject } from 'react';

type EventTarget = Window | Document | HTMLElement | null;

export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: EventTarget | RefObject<EventTarget>,
  options?: boolean | AddEventListenerOptions
): void {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const targetElement = element && 'current' in element ? element.current : element;
    const target = targetElement ?? window;

    if (!(target && target.addEventListener)) return;

    const eventListener = (event: Event) => savedHandler.current(event as WindowEventMap[K]);
    
    target.addEventListener(eventName, eventListener, options);
    return () => target.removeEventListener(eventName, eventListener, options);
  }, [eventName, element, options]);
}

export type {};
