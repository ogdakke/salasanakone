import { debounce } from "@/common/utils/debounce"
import { FORM_STATE_KEY } from "@/config"
import type { FormState } from "@/models"
import { set } from "idb-keyval"

/**
 * Sets the given state directly to localStorage & indexedDB
 * @param payload state to set
 */
export const setFormState = async (payload: FormState): Promise<void> => {
  debouncedSetLocalStorage(payload)
  debouncedSetFormState(payload)
}

const debouncedSetLocalStorage = debounce(async (payload: FormState) => {
  localStorage.setItem(FORM_STATE_KEY, JSON.stringify(payload))
}, 300)

const debouncedSetFormState = debounce(async (payload: FormState) => {
  await set(FORM_STATE_KEY, payload)
}, 300)
