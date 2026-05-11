import { useEffect, useRef } from 'react';

/**
 * Sync calculator inputs with URL search params.
 * Enables shareable calculator links.
 */
export function useCalcUrlState(
  calcId: string,
  values: Record<string, number | string | boolean>,
  setters: Record<string, (value: number | string | boolean) => void>
) {
  const initialized = useRef(false);

  // Read URL params on mount and apply them
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const params = new URLSearchParams(window.location.search);
    const prefix = calcId + '_';
    for (const [key, setter] of Object.entries(setters)) {
      const paramKey = prefix + key;
      const raw = params.get(paramKey);
      if (raw !== null) {
        const currentValue = values[key];
        if (typeof currentValue === 'number') {
          const parsed = parseFloat(raw);
          if (!isNaN(parsed)) {
            setter(parsed);
          }
        } else if (typeof currentValue === 'boolean') {
          setter(raw === 'true');
        } else {
          setter(raw);
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Write URL params when values change (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const prefix = calcId + '_';

      for (const [key, value] of Object.entries(values)) {
        const paramKey = prefix + key;
        if (value !== undefined && value !== null && value !== '') {
          params.set(paramKey, String(value));
        } else {
          params.delete(paramKey);
        }
      }

      const newSearch = params.toString();
      const currentHash = window.location.hash;
      const basePath = currentHash.split('?')[0];
      const newHash = basePath + (newSearch ? '?' + newSearch : '');

      if (newHash !== currentHash) {
        window.history.replaceState(null, '', newHash);
      }
    }, 800);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calcId, ...Object.values(values)]);
}

export function buildCalcShareUrl(calcId: string, values: Record<string, number | string | boolean>): string {
  const params = new URLSearchParams();
  const prefix = calcId + '_';
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== null && value !== '') {
      params.set(prefix + key, String(value));
    }
  }
  const base = typeof window !== 'undefined' ? window.location.origin + '/#' + window.location.pathname.split('/').pop() || '' : '';
  return base + (params.toString() ? '?' + params.toString() : '');
}
