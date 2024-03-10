import { type Dispatch, type Reducer, useCallback, useEffect, useReducer } from "react"

const initializer =
  (key: string) =>
  <T>(initial: T) => {
    const stored = localStorage.getItem(key)
    if (!stored) return initial
    return JSON.parse(stored) as T
  }

export const usePersistedReducer = <T extends Record<PropertyKey, unknown>, A>(
  reducer: Reducer<T, A>,
  initialState: T,
  key: string,
): [T, Dispatch<A>, VoidFunction] => {
  const [state, dispatch] = useReducer(reducer, initialState, initializer(key))
  const clearValue = useCallback(() => localStorage.removeItem(key), [key])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [state])

  return [state, dispatch, clearValue]
}
