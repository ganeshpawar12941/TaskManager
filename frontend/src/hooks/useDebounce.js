/**
 * src/hooks/useDebounce.js
 *
 * Generic debounce hook that delays updating a value until after
 * the specified delay has elapsed without new calls.
 * Ideal for search input fields.
 *
 * Usage:
 *   const debouncedSearch = useDebounce(searchTerm, 400);
 */

import { useState, useEffect } from 'react';

/**
 * useDebounce
 *
 * @param {*} value - The value to debounce
 * @param {number} [delay=400] - Debounce delay in milliseconds
 * @returns {*} The debounced value
 */
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: clear the timer if value changes before delay elapses
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
