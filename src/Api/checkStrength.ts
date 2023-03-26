// import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
const sanat = await import("../sanat").then((r) => r.sanat)

// const loadOptions = async () => {
//   const zxcvbnCommonPackage = await import(
//     /* webpackChunkName: "zxcvbnCommonPackage" */ '@zxcvbn-ts/language-common'
//   )
//   const zxcvbnEnPackage = await import(
//     /* webpackChunkName: "zxcvbnEnPackage" */ '@zxcvbn-ts/language-en'
//   )

//   return {
//     dictionary: {
//       ...zxcvbnCommonPackage.default.dictionary,
//       ...zxcvbnEnPackage.default.dictionary,
//     },
//     graphs: zxcvbnCommonPackage.default.adjacencyGraphs,
//     translations: zxcvbnEnPackage.default.translations,
//   }
// }




// export const checkStrength = async (password: string) => {
//     zxcvbnOptions.setOptions(await loadOptions())
//     return zxcvbn(password, sanat)
//   }

const check = (await import("zxcvbn")).default

export const checkStrength = async (password: string) => {
  return check(password, sanat)
}