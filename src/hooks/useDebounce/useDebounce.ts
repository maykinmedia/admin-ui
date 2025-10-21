import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of a value. The returned value updates only after the
 * specified delay has elapsed without further changes to the input.
 *
 * @typeParam T - The value type to debounce.
 * @param value - The input value to debounce.
 * @param delay - The debounce delay in milliseconds. Defaults to 250.
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number = 250): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      if (!controller.signal.aborted) setDebounced(value);
    }, delay);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debounced;
}
