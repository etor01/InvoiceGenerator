'use client';
import { useState, useEffect, useRef } from 'react';

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (val: T) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // quota exceeded or private browsing — silently ignore
    }
  }, [key, value]);

  return [value, setValue];
}
