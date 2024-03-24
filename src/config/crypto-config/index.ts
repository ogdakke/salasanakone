import { Language } from "@/models/translations"

export const minLengthForChars = 3
export const minLengthForWords = 1
export const maxLengthForChars = 64
export const maxLengthForWords = 12

export function getConfig(language: Language = Language.fi) {
  return {
    // Length restrictions
    minLengthForChars: 3,
    minLengthForWords: 1,
    maxLengthForChars: 128,
    maxLengthForWords: 28,
    // Strings to generate from
    generationStrings: getGenerationStrings(language),
  }
}

const characters = {
  fi: "abcdefghijklmnopqrstuyäöxz",
  en: "abcdefghijklmnopqrstuyxz",
}
const numbers = "0123456789"
const specials = "><,.-_*?+()@%&!$€=#"

function getChars(language?: Language) {
  switch (language) {
    case Language.en:
      return characters.en
    default:
      return characters.fi
  }
}

function getGenerationStrings(language?: Language) {
  const characters = getChars(language)

  return {
    numbers: numbers,
    characters: characters,
    specials: specials,
    specialsAndNums: `${characters}${numbers}${specials}`,
    charactersAndSpecialCharacters: `${characters}${specials}`,
    charsWithNumbers: `${characters}${numbers}`,
  }
}

export const validationErrorMessages = (min: number, max: number) => {
  const validationErrors = {
    notStringOrNumber: "Type of length must be number or string",
    nullOrUndefined: "Length cannot be undefined or null",
    notNumericStringOrNumber: "Length must be a number, or a string containing a numeric integer",
    smallerThanOne: "Length must be a positive number larger than 0",
    tooLong: `Length must not exceed ${max}`,
    tooShort: `Length cannot be smaller than ${min}`,
    notValidRange: `Max '${max}' must be larger than min: '${min}'`,
  }
  return validationErrors
}

export const generationErrors = {
  noStringArrayFound: "No string[] found to capitalize",
  noStringArrayForAddingNumber: "No string[] supplied to add number to",
  noParametresFound: "Something went wrong with getting the parametres",
}
