import { useState, useEffect, useRef } from 'react';
import { storage } from './storage';

const PREFIX = 'calc_';

/**
 * Drop-in replacement for useState that persists to localStorage.
 * Automatically saves on change (debounced 500ms).
 */
export function usePersistedState<T>(
  calcId: string,
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const storageKey = PREFIX + calcId + '_' + key;
  const [value, setValue] = useState<T>(() => {
    const saved = storage.get<T | null>(storageKey, null);
    return saved !== null ? saved : defaultValue;
  });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      storage.set(storageKey, value);
    }, 500);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, storageKey]);

  return [value, setValue];
}

/**
 * Reset all persisted state for a calculator.
 */
export function resetCalcState(calcId: string) {
  const fullPrefix = PREFIX + calcId + '_';
  // Remove all keys matching this calculator
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key && key.startsWith('pp_' + fullPrefix)) {
      localStorage.removeItem(key);
    }
  }
}

/**
 * Check if a calculator has any saved state.
 */
export function hasCalcState(calcId: string): boolean {
  const fullPrefix = 'pp_' + PREFIX + calcId + '_';
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(fullPrefix)) return true;
  }
  return false;
}
