import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core"
const loadOptions = async () => {
  const zxcvbnFiPackage = await import("@zxcvbn-ts/language-fi")
  return {
    dictionary: {
      ...zxcvbnFiPackage.dictionary,
      // userInputs: sanat.default, // todo fix this
    },
    translations: zxcvbnFiPackage.translations,
  }
}
console.time("setOptions")
zxcvbnOptions.setOptions(await loadOptions())
console.timeEnd("setOptions")

export const checkStrength = (password: string) => {
  return zxcvbn(password)
}
