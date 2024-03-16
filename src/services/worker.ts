import type { CheckerWorkerData } from "@/models"
import type { Language } from "@/models/translations"
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core"
import type { OptionsType, ZxcvbnResult } from "@zxcvbn-ts/core"
import { get } from "idb-keyval"
const isDev = import.meta.env.DEV

const formState = await get("formState")
console.info("formState from worker", formState)

/**
 * Load the needed settings for zxcvbn - called upon first load and on language change
 * @param language language to switch dictionaries to
 * @returns
 */
async function loadOptions(language?: Language): Promise<OptionsType> {
  isDev && console.time("load-dictionaries")
  const [zxcvbnFiPackage, zxcvbnEnPackage] = await Promise.all([
    import("@zxcvbn-ts/language-fi"),
    import("@zxcvbn-ts/language-en"),
  ])
  isDev && console.timeEnd("load-dictionaries")

  return {
    dictionary: {
      ...zxcvbnFiPackage.dictionary,
      ...zxcvbnEnPackage.dictionary,
      // userInputs: sanat.default, // todo fix this
    },
    translations: zxcvbnFiPackage.translations,
  }
}

function checkStrength(password: string) {
  return zxcvbn(password)
}
;(async () => {
  isDev && console.debug("loading zxcvbn options")
  isDev && console.time("zxcvbn-set-options")
  zxcvbnOptions.setOptions(await loadOptions())
  isDev && console.timeEnd("zxcvbn-set-options")
})()

let prev: ZxcvbnResult | undefined
self.onmessage = async (e: MessageEvent<CheckerWorkerData>) => {
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
