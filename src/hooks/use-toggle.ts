import { useState, useCallback } from 'react';

export function useToggle(initial = false): [boolean, () => void, (v: boolean) => void, () => void, () => void] {
  const [value, setValue] = useState(initial);
  
  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return [value, toggle, setValue, setTrue, setFalse];
}

export type {};
