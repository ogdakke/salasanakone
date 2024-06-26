import { useTranslation } from "@/common/hooks/useLanguage"

export function isKey<T extends object>(x: T, k: PropertyKey): k is keyof T {
  return k in x
}

/**
 * returns a substring of desired length {length} if str is longer than {length}
 * @param length desired length
 * @param str string to check
 * @returns string, mutated or not
 */
export function validateLength(str: string, length: number): string {
  let final = str
  if (str.length > length) {
    final = str.substring(0, length)
  }
  return final
}

export const isIOS =
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.userAgent === "MacIntel" && navigator.maxTouchPoints > 1)

export const isAndroid = navigator.userAgent.match(/Android/i)

export function strengthToColorAndLabel(value: number) {
  const { t } = useTranslation()

  switch (value.toString()) {
    case "0":
      // To be able to set the state, these need to be strings
      return {
        label: t("strengthAwful").toString(),
        color: "rgb(180, 0, 10)",
      }
    case "1":
      return {
        label: t("strengthBad").toString(),
        color: "rgb(220, 60, 60)",
      }
    case "2":
      return {
        label: t("strengthOk").toString(),
        color: "rgb(240, 173, 78)",
      }
    case "3":
      return {
        label: t("strengthGood").toString(),
        color: "rgb(117, 215, 93)",
      }
    case "4":
      return {
        label: t("strengthGreat").toString(),
        color: "rgb(60, 232, 61)",
      }
    case "-1":
      return {
        label: t("loadingStrength").toString(),
        color: "rgb(108, 241, 109, 0)",
      }
    default:
      return {
        label: t("strengthDefault").toString(),
        color: "rgb(0,0,0)",
      }
  }
}
