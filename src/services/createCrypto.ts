import { generationErrors, getConfig, validationErrorMessages } from "@/config"
import type { PassCreationRules } from "@/models"
import type { Language } from "@/models/translations"

type PassLength = string | number
type StringsConfig = ReturnType<typeof getConfig>["generationStrings"]
/**
 * Generates a passphrase/password based on supplied parametres
 */
export function createPassphrase(args: {
  passLength: PassLength
  inputs: PassCreationRules
  language: Language
  dataset?: string[]
}): string {
  const { passLength, inputs, language } = args

  const {
    minLengthForChars,
    maxLengthForChars,
    minLengthForWords,
    maxLengthForWords,
    generationStrings,
  } = getConfig(language)

  const isUsingWords = inputs.words.selected

  const minLength = isUsingWords ? minLengthForWords : minLengthForChars
  const maxLength = isUsingWords ? maxLengthForWords : maxLengthForChars
  const len = validateStringToBeValidNumber(passLength, minLength, maxLength)

  if (isUsingWords && args.dataset) {
    return handleReturns(len, inputs, generationStrings, args.dataset)
  }

  return handleReturns(len, inputs, generationStrings)
}

function handleReturns(
  len: number,
  inputs: PassCreationRules,
  config: StringsConfig,
  dataset?: string[],
): string {
  const { randomChars, words, uppercase } = inputs
  const USER_SPECIALS = randomChars.value || ""

  const getFinalString = (wordString: string[]): string => {
    return handleWordsTrue({ inputs, wordString, USER_SPECIALS })
  }

  const applyUpperCase = (str: string): string => {
    const shouldBeUppercase = uppercase.selected
    const isNotWordString = !words.selected

    if (shouldBeUppercase && isNotWordString) {
      return toUppercase(str)
    }

    return str
  }

  if (!dataset) {
    const randomCharString = handleRandomCharStrings({ inputs, len, config })
    return applyUpperCase(randomCharString)
  }

  const wordString = getRandomWordsFromDataset(len, dataset)
  const finalString = getFinalString(wordString)
  return applyUpperCase(finalString)
}

function handleWordsTrue({
  inputs,
  wordString,
  USER_SPECIALS,
}: {
  inputs: PassCreationRules
  wordString: string[]
  USER_SPECIALS: string
}): string {
  if (inputs.randomChars.value != null) {
    return applyTransformationsToWords(inputs, wordString).join(USER_SPECIALS)
  }

  if (inputs.numbers.selected) {
    return addRandomNumberToString(wordString).join("").toString()
  }

  if (inputs.uppercase.selected) {
    return capitalizeFirstLetter(wordString).join("")
  }

  return wordString.join("")
}

function applyTransformationsToWords(inputs: PassCreationRules, wordString: string[]): string[] {
  if (inputs.numbers.selected) {
    if (inputs.uppercase.selected) {
      return addRandomNumberToString(capitalizeFirstLetter(wordString))
    }
    return addRandomNumberToString(wordString)
  }

  if (inputs.uppercase.selected) {
    return capitalizeFirstLetter(wordString)
  }

  return wordString
}

function handleRandomCharStrings({
  inputs,
  len,
  config,
}: {
  inputs: PassCreationRules
  len: number
  config: StringsConfig
}): string {
  const { specialsAndNums, characters, charsWithNumbers, charactersAndSpecialCharacters } = config

  if (inputs.randomChars.selected && inputs.numbers.selected) {
    return createFromString(specialsAndNums, len)
  }

  if (!inputs.numbers.selected && !inputs.randomChars.selected) {
    return createFromString(characters, len)
  }

  if (inputs.numbers.selected) {
    return createFromString(charsWithNumbers, len)
  }

  if (inputs.randomChars.selected) {
    return createFromString(charactersAndSpecialCharacters, len)
  }
  throw new Error(generationErrors.noParametresFound)
}

/**
 * Creates a randomised string of characters from an input string
 */
const createFromString = (stringToUse: string, len: number): string => {
  const numArr = generateRandomArray(len, 0, stringToUse.length - 1)
  const stringArr: string[] = new Array(numArr.length)

  for (let i = 0; i < numArr.length; i++) {
    // biome-ignore lint/style/noNonNullAssertion: wtf it's a damn forloop!!
    stringArr[i] = stringToUse[numArr[i]!]!
  }

  return stringArr.join("")
}

const validateStringToBeValidNumber = (
  passLength: PassLength,
  min: number,
  max: number,
): number => {
  const errors = validationErrorMessages(min, max)

  if (passLength === undefined || passLength === null) {
    // Since there is a default value, this will probably never be hit
    throw new Error(errors.nullOrUndefined)
  }

  if (typeof passLength !== "string" && typeof passLength !== "number") {
    throw new Error(errors.notStringOrNumber)
  }

  if (Number.isNaN(passLength)) {
    throw new Error(errors.notNumericStringOrNumber)
  }
  const strAsNumber = typeof passLength === "string" ? Number.parseInt(passLength, 10) : passLength

  if (Number.isNaN(strAsNumber)) {
    throw new Error(errors.notNumericStringOrNumber)
  }

  if (strAsNumber < 1) {
    throw new Error(errors.smallerThanOne)
  }

  if (strAsNumber > max) {
    throw new Error(errors.tooLong)
  }

  if (strAsNumber < min) {
    throw new Error(errors.tooShort)
  }

  return Math.round(strAsNumber)
}

const someCharToUpper = (someStr: string): string => {
  const len = someStr.length
  const arr = generateRandomArray(len - 1, 0, len)

  const strArr = someStr.split("")
  // biome-ignore lint/complexity/noForEach: <explanation>
  arr.forEach((i) => {
    if (i < len) {
      // biome-ignore lint/style/noNonNullAssertion: It is literally there 🤞
      strArr[i] = strArr[i]!.toUpperCase()
    }
  })

  return strArr.join("")
}

/**
 * converts a single character from either a string or an array of strings to uppercase
 */
function toUppercase(stringToUpper: string): string
function toUppercase(stringToUpper: string[]): string[]
function toUppercase(stringToUpper: string[] | string): string | string[] {
  if (typeof stringToUpper === "string") {
    return someCharToUpper(stringToUpper)
  }

  return stringToUpper.map((stringArr) => {
    return someCharToUpper(stringArr)
  })
}

const isNumberRangeValid = (min: number, max: number) => min < max

const calculateRequestBytes = (range: number): number => {
  return Math.ceil(Math.log2(range) / 8)
}

function generateRandomValueFromBytes(requestBytes: number): number {
  const maxNum = 256 ** requestBytes
  const arr = new Uint8Array(requestBytes)
  let val = 0

  do {
    crypto.getRandomValues(arr)
    val = 0

    for (let i = 0; i < requestBytes; i++) {
      // biome-ignore lint/style/noNonNullAssertion: let's not check this
      val = (val << 8) + arr[i]!
    }
  } while (val >= maxNum - (maxNum % requestBytes))

  return val
}

/**
 * Generate a random integer with equal chance in min <= r < max.
 * @param min minimum value for the integer
 * @param max maximum value for the integer
 * @returns random integer
 * @link https://stackoverflow.com/questions/41437492/how-to-use-window-crypto-getrandomvalues-to-get-random-values-in-a-specific-rang
 */
function generateRandomNumberInRange(min: number, max: number): number {
  if (!isNumberRangeValid(min, max)) {
    const { notValidRange } = validationErrorMessages(min, max)
    throw new Error(notValidRange)
  }

  const range = max - min
  const requestBytes = calculateRequestBytes(range)

  if (requestBytes === 0) {
    return 0
  }

  const randomValue = generateRandomValueFromBytes(requestBytes)

  return min + (randomValue % range)
}

/**
 * generates an array of random numbers between min and max, with length 'len'
 */
function generateRandomArray(len: number, min: number, max: number): number[] {
  const arr = new Array<number>(len)
  for (let i = 0; i < len; i++) {
    arr[i] = generateRandomNumberInRange(min, max)
  }
  return arr
}

/**
 * from an string[], capitalize any strings first letter
 */
function capitalizeFirstLetter(stringArrToConvert: string[] | undefined): string[] {
  if (!stringArrToConvert) {
    throw new Error(`Error capitalising string: ${stringArrToConvert}`)
  }
  const convertedArr = stringArrToConvert.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1)
  })
  return convertedArr
}

/**
 * generates an array of length `length` from randomly selected strings in stringDataset
 */
function getRandomWordsFromDataset(length: number, stringDataset: string[]): string[] {
  const maxCount = stringDataset.length - 1 // the max word count in [language].json

  const randomNumsArray = generateRandomArray(length, 0, maxCount)

  const sanaArray: string[] = new Array(length)

  for (let i = 0; i < length; i++) {
    // biome-ignore lint/style/noNonNullAssertion: it's fine I'm sure
    sanaArray[i] = stringDataset[randomNumsArray[i]!]!
  }

  return sanaArray
}

/**
 * adds a random number at the end of some string in an array
 */
const addRandomNumberToString = (stringArr: string[] | undefined): string[] => {
  if (!stringArr) {
    throw new Error(generationErrors.noStringArrayForAddingNumber)
  }

  const indexToSelect = generateRandomNumberInRange(0, stringArr.length)
  const numToPadWith = generateRandomNumberInRange(0, 10).toString()

  const updatedArray = stringArr.map((str, i) => {
    if (i === indexToSelect) {
      return str + numToPadWith
    }
    return str
  })

  return updatedArray
}
