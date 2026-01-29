import { type Dispatch, type Reducer, useCallback, useEffect, useReducer } from "react"

/**
 * Creates an initializer that loads state from localStorage,
 * but uses initial values for excluded keys (e.g., language from URL)
 */
const createInitializer =
  <T extends Record<PropertyKey, unknown>>(key: string, excludeKeys: (keyof T)[] = []) =>
  (initial: T): T => {
    const stored = localStorage.getItem(key)
    if (!stored) return initial

    const parsed = JSON.parse(stored) as T

    // Merge stored state with initial values for excluded keys
    const result = { ...parsed }
    for (const excludeKey of excludeKeys) {
      if (excludeKey in initial) {
        result[excludeKey] = initial[excludeKey]
      }
    }

    return result
  }

/**
 * Like useReducer, but persists state to localStorage.
 * Keys in excludeFromPersistence will always use initialState values
 * and won't be saved to localStorage.
 */
export const usePersistedReducer = <T extends Record<PropertyKey, unknown>, A>(
  reducer: Reducer<T, A>,
  initialState: T,
  key: string,
  excludeFromPersistence: (keyof T)[] = [],
): [T, Dispatch<A>, VoidFunction] => {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    createInitializer(key, excludeFromPersistence),
  )
  const clearValue = useCallback(() => localStorage.removeItem(key), [key])

  useEffect(() => {
    // Remove excluded keys before persisting
    const stateToPersist = { ...state }
    for (const excludeKey of excludeFromPersistence) {
      delete stateToPersist[excludeKey]
    }
    localStorage.setItem(key, JSON.stringify(stateToPersist))
  }, [state, key, excludeFromPersistence])

  return [state, dispatch, clearValue]
}
