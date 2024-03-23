import { FORM_STATE_KEY } from "@/config"
import type { FormState } from "@/models"
import { debounce } from "@zxcvbn-ts/core"
import { set } from "idb-keyval"

/**
 * Sets the given state directly to localStorage & indexedDB
 * @param payload state to set
 */
export const setFormState = async (payload: FormState): Promise<void> => {
  localStorage.setItem(FORM_STATE_KEY, JSON.stringify(payload))
  debouncedSetFormState(payload)
}

const debouncedSetFormState = debounce(async (payload: FormState) => {
  await set(FORM_STATE_KEY, payload)
}, 300)
