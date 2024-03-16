import type { CheckerWorkerPostMessageData, FormState } from "@/models"
import { Language } from "@/models/translations"
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core"
import type { OptionsType, ZxcvbnResult } from "@zxcvbn-ts/core"
import { get } from "idb-keyval"

const isDev = import.meta.env.DEV

/** gets the correct dictionaries for supplied language */
async function getDic(lang: Language): Promise<OptionsType | undefined> {
  switch (lang) {
    case Language.fi: {
      return isDev
        ? await import("@zxcvbn-ts/language-fi")
        : // @ts-expect-error import from cdn
          await import("https://cdn.jsdelivr.net/npm/@zxcvbn-ts/language-fi@3.0.2/+esm")
    }
    case Language.en: {
      return isDev
        ? await import("@zxcvbn-ts/language-en")
        : // @ts-expect-error import from cdn
          await import("https://cdn.jsdelivr.net/npm/@zxcvbn-ts/language-en@3.0.2/+esm")
    }
    default:
      console.error("no language found to import zxcvbn options for", lang)
      return undefined
  }
}

/**
 * Load the needed dictionaries and options for zxcvbn -
 * called upon first load and on language change
 * @param language language to switch dictionaries to
 * @returns
 */
async function loadOptions(lang: Language): Promise<OptionsType> {
  isDev && console.time(`load-dictionaries-${lang}`)
  const fetchedPackage = await getDic(lang)
  isDev && console.timeEnd(`load-dictionaries-${lang}`)

  return {
    dictionary: {
      ...fetchedPackage?.dictionary,
    },
    translations: fetchedPackage?.translations,
  }
}

function checkStrength(password: string): ZxcvbnResult {
  return zxcvbn(password)
}

/** Initialize the worker with zxcvbn options for the given language */
async function initWorker(): Promise<void> {
  const formState = await get<FormState>("formState")
  isDev && console.info("formState from worker", formState)
  isDev && console.info("loading zxcvbn options")
  await setZxcvbnOptions(formState?.language)
}

initWorker()

let prev: ZxcvbnResult | undefined

self.onmessage = async function handleOnMessage(
  e: MessageEvent<CheckerWorkerPostMessageData>,
): Promise<void> {
  if (typeof e.data === "string") {
    return await handleLanguageChange(e.data)
  }

  if (prev && prev.password === e.data.strValue) {
    // Previous calculation was done on same string as supplied
    isDev &&
      console.debug("cache hit on strength calculation", {
        prev,
        data: e.data.strValue,
      })

    return self.postMessage(prev)
  }

  isDev && console.debug("worker got uncached message", e.data)

  const result = checkStrength(e.data.strValue)
  prev = result
  return self.postMessage(result)
}

async function setZxcvbnOptions(lang = Language.fi): Promise<void> {
  isDev && console.time(`zxcvbn-set-options-${lang}`)
  zxcvbnOptions.setOptions(await loadOptions(lang))
  isDev && console.timeEnd(`zxcvbn-set-options-${lang}`)
}

async function handleLanguageChange(lang: Language): Promise<void> {
  await setZxcvbnOptions(lang)
}
