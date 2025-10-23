import { useState, useEffect } from 'react'

/**
 * Custom hook to replace Spark's useKV with localStorage
 * Provides the same API: [value, setValue]
 * setValue can accept either a value or an updater function
 */
export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize state from localStorage or use default
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  })

  // Update localStorage when value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error)
    }
  }, [key, value])

  // Wrapper to support both direct values and updater functions
  const setValueWrapper = (newValue: T | ((prev: T) => T)) => {
    setValue(newValue)
  }

  return [value, setValueWrapper]
}
