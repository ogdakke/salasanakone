import { maxLengthForWords, minLengthForChars } from "@/config"

export function validatePasswordLength(sliderValue: number, isWords: boolean) {
  if (
    isWords &&
    (sliderValue > maxLengthForWords || sliderValue < 1) // should return false
  ) {
    return maxLengthForWords
  }

  if (!isWords && sliderValue < minLengthForChars) {
    return minLengthForChars
  }

  return sliderValue
}
