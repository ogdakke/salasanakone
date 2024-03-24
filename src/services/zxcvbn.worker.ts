import { FORM_STATE_KEY } from "@/config"
import type { CheckerWorkerPostMessageData, FormState } from "@/models"
import { Language } from "@/models/translations"
import { Stores, getDataForKey } from "@/services/database/db"
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core"
import type { OptionsType, ZxcvbnResult } from "@zxcvbn-ts/core"
import { adjacencyGraphs, dictionary } from "@zxcvbn-ts/language-common"
import { get } from "idb-keyval"

const isDev = import.meta.env.DEV

/** gets the correct dictionaries for supplied language */
async function getDic(lang: Language): Promise<OptionsType | undefined> {
  switch (lang) {
    case Language.fi: {
      return isDev
        ? await import("@zxcvbn-ts/language-fi")
        : await import(
            // @ts-expect-error import from cdn
            "https://cdn.jsdelivr.net/npm/@zxcvbn-ts/language-fi@3.0.2/+esm"
          )
    }
    case Language.en: {
      return isDev
        ? await import("@zxcvbn-ts/language-en")
        : await import(
            // @ts-expect-error import from cdn
            "https://cdn.jsdelivr.net/npm/@zxcvbn-ts/language-en@3.0.2/+esm"
          )
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
 * @returns zxcvbn options object to be set
 */
async function loadOptions(lang: Language): Promise<OptionsType> {
  isDev && console.time(`load-dictionaries-${lang}`)
  const fetchedPackage = await getDic(lang)
  const customDic = await getDataForKey(Stores.Languages, lang)
  isDev && console.timeEnd(`load-dictionaries-${lang}`)

  isDev && console.debug("loaded custom dictionary of length: ", customDic?.length)

  if (!fetchedPackage) {
    throw new Error(`Failed to fetch zxcvbn package for ${lang}`)
  }

  return {
    dictionary: {
      ...dictionary,
      ...fetchedPackage.dictionary,
      userInputs: customDic || [],
    },
    translations: {
      ...fetchedPackage.translations,
      timeEstimation: {
        ...fetchedPackage.translations?.timeEstimation,
        // @ts-ignore it just needs to complain huh?
        centuries:
          lang === Language.fi
            ? "vuosisatoja"
            : fetchedPackage.translations?.timeEstimation.centuries,
      },
    },
    graphs: adjacencyGraphs,
  }
}

function checkStrength(password: string): ZxcvbnResult {
  return zxcvbn(password)
}

/** Initialize the worker with zxcvbn options for the given language */
async function initWorker(): Promise<void> {
  const formState = await get<FormState>(FORM_STATE_KEY)
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
