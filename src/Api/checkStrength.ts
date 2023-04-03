import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'

const loadOptions = async () => {
  const sanat = (await import("../sanat")).sanat
  // const zxcvbnCommonPackage = await import('@zxcvbn-ts/language-common')
  const zxcvbnFiPackage = await import('@zxcvbn-ts/language-fi')
  // const zxcvbnEnPackage = await import('@zxcvbn-ts/language-en')

  return {
    dictionary: {
      // ...zxcvbnCommonPackage.default.dictionary,
      ...zxcvbnFiPackage.default.dictionary,
      userInputs: sanat
    },
    // graphs: zxcvbnCommonPackage.default.adjacencyGraphs,
    translations: zxcvbnFiPackage.default.translations,

  }
}
console.time("setOptions")
zxcvbnOptions.setOptions(await loadOptions())
console.timeEnd("setOptions")

export const checkStrength = async (password: string) => {
    return zxcvbn(password)
  }

// const check = (await import("zxcvbn")).default

// export const checkStrength = async (password: string) => {
//   return check(password, sanat)
// }