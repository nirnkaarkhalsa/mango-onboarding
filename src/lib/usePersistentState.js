import { useEffect, useState } from 'react'

// Saves state in the browser so progress survives a refresh during a demo.
// Falls back to in-memory state if storage is blocked (private windows, etc.).
export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key)
      return saved ? JSON.parse(saved) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage unavailable: keep working in memory.
    }
  }, [key, value])

  return [value, setValue]
}
