import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'

const loadOptions = async () => {
  const sanat = await import("../sanat")
  const zxcvbnCommonPackage = await import('@zxcvbn-ts/language-common')
  // const zxcvbnEnPackage = await import('@zxcvbn-ts/language-en')
  const zxcvbnFiPackage = await import('@zxcvbn-ts/language-fi')

  return {
    dictionary: {
      ...zxcvbnCommonPackage.default.dictionary,
      ...zxcvbnFiPackage.default.dictionary,
      userInputs: sanat.sanat
    },
    graphs: zxcvbnCommonPackage.default.adjacencyGraphs,
    translations: zxcvbnFiPackage.default.translations,
  }
}

export const checkStrength = async (password: string) => {
    zxcvbnOptions.setOptions(await loadOptions())
    return zxcvbn(password)
  }

// const check = (await import("zxcvbn")).default

// export const checkStrength = async (password: string) => {
//   return check(password, sanat)
// }