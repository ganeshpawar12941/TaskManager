/**
 * src/hooks/useLocalStorage.js
 *
 * Custom hook that syncs state with localStorage.
 * Falls back to the initial value if no stored value exists.
 *
 * Usage:
 *   const [theme, setTheme] = useLocalStorage('theme', 'light');
 */

import { useState, useEffect } from 'react';

/**
 * useLocalStorage
 *
 * @param {string} key - localStorage key
 * @param {*} initialValue - Default value if key doesn't exist
 * @returns {[*, Function]} [storedValue, setValue]
 */
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`useLocalStorage: Error reading key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      // Support functional updates
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`useLocalStorage: Error setting key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
