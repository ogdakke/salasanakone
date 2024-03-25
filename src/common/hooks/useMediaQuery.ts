import { useCallback, useSyncExternalStore } from "react"

type MediaQuery = `(${string}:${string})`

function getSnapshot(query: MediaQuery) {
  return window.matchMedia(query).matches
}

function subscribe(onChange: () => void, query: MediaQuery) {
  const mql = window.matchMedia(query)
  mql.addEventListener("change", onChange)

  return () => {
    mql.removeEventListener("change", onChange)
  }
}

/**
 * @link https://julesblom.com/writing/usesyncexternalstore
 * syncs a media query listener
 * @param query query to listen to
 * @returns if the media query matches
 */
export function useMediaQuery(query: MediaQuery) {
  const subscribeMediaQuery = useCallback(
    (onChange: () => void) => {
      subscribe(onChange, query)
    },
    [query],
  )

  // @ts-ignore whaaaaatt??
  const matches = useSyncExternalStore(subscribeMediaQuery, () => getSnapshot(query))

  return matches
}
