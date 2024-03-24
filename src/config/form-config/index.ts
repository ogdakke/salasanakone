import { Language } from "@/models/translations"

/** The version number for IDB stores to allow for sunsetting KV pairs */
const STORE_VERSION = 1 as const
/** Form state's key in localStorage and IDB */
export const FORM_STATE_KEY = `formState-V${STORE_VERSION}`

export const supportedLanguages = Object.values(Language)
export const inputFieldMaxLength = 8
