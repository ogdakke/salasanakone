import { EffectCallback, useEffect } from "react"

export function useEffectOnce(effect: EffectCallback) {
  // eslint-disable react-hooks/exhaustive-deps
  useEffect(effect, [])
}
