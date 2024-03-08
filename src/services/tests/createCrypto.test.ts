import { getConfig, validationErrorMessages } from "@/config"
import { InputType, PassCreationRules } from "@/models"
import { Language } from "@/models/translations"
import { createPassphrase } from "@/services/createCrypto"
import { describe, expect, it } from "vitest"

const dataset = (await import("@/sanat.json")).default

type TestConfig = {
  language?: Language
  word?: boolean
  inputType?: InputType
  randomCharactersInString?: boolean
  numbers?: boolean
  uppercaseCharacters?: boolean
  inputFieldValueFromUser?: string
}

const defaultConfig: TestConfig = {
  language: Language.fi,
  word: false,
  randomCharactersInString: false,
  numbers: false,
  uppercaseCharacters: false,
  inputType: "checkbox",
  inputFieldValueFromUser: "-",
}

const config = getConfig(defaultConfig.language)
const { minLengthForChars, maxLengthForChars, minLengthForWords, maxLengthForWords } = config
let variableMinLength = minLengthForChars
let variableMaxLength = maxLengthForChars
const testData = (testConfig: TestConfig = {}): PassCreationRules => {
  const {
    word,
    randomCharactersInString,
    numbers,
    inputType,
    uppercaseCharacters,
    inputFieldValueFromUser,
  } = {
    ...defaultConfig,
    ...testConfig,
  } // Merge default values with provided ones

  variableMinLength = word ? minLengthForWords : minLengthForChars
  variableMaxLength = word ? maxLengthForWords : maxLengthForChars
  return {
    words: {
      inputType: "radio",
      info: "useWordsInfo",
      selected: word || false, //If this is false, it will return a random string of characters
      value: "",
    },
    randomChars: {
      inputType: inputType || "input",
      info: "useCharactersInfo",
      selected: randomCharactersInString || false,
      value: inputFieldValueFromUser, //this only should apply if word === true
    },
    uppercase: {
      inputType: "checkbox",
      info: "useUppercaseInfo",
      selected: uppercaseCharacters || false,
      value: "",
    },
    numbers: {
      inputType: "checkbox",
      info: "useNumbersInfo",
      selected: numbers || false,
      value: "",
    },
  }
}
const language = Language.fi
const errors = validationErrorMessages(variableMinLength, variableMaxLength)
describe("createPassphrase() creates a random string with correct length", () => {
  it("should return a string with correct length", () => {
    expect(
      createPassphrase({ dataset, language, passLength: 10, inputs: testData() }),
    ).toHaveLength(10)
    expect(
      createPassphrase({
        dataset,
        language,
        passLength: "10",
        inputs: testData({ numbers: true }),
      }),
    ).toHaveLength(10)
    expect(
      createPassphrase({
        dataset,
        language,
        passLength: "10",
        inputs: testData({ randomCharactersInString: true }),
      }),
    ).toHaveLength(10)

    /**weird values, but they are number */
    expect(
      createPassphrase({ dataset, language, passLength: "007A", inputs: testData() }),
    ).toHaveLength(7)
    expect(
      createPassphrase({
        dataset,
        language,
        passLength: "012whaaat??? its not weird at all that this is valid",
        inputs: testData({ numbers: true }),
      }),
    ).toHaveLength(12)
    expect(
      createPassphrase({ dataset, language, passLength: "10.5", inputs: testData() }),
    ).toHaveLength(10)
  })

  it("should return a random string even if no dataset supplied", () => {
    expect(createPassphrase({ language, passLength: 32, inputs: testData({}) })).toHaveLength(32)
  })

  it("should reject invalid values even if no dataset supplied", () => {
    expect(() =>
      createPassphrase({ language, passLength: 400, inputs: testData({ word: false }) }),
    ).toThrow(errors.tooLong)

    expect(() =>
      createPassphrase({ language, passLength: "huh?", inputs: testData({}) }),
    ).toThrowError(errors.notNumericStringOrNumber)
  })

  it("should return a string with length maxLengthForChars", () => {
    expect(
      createPassphrase({ dataset, language, passLength: maxLengthForChars, inputs: testData({}) }),
    ).toHaveLength(maxLengthForChars)
  })

  it("should throw errors on a string with weird values", () => {
    /** Testing parsing of strings */
    expect(() =>
      createPassphrase({ dataset, language, passLength: "huh?", inputs: testData({}) }),
    ).toThrowError(errors.notNumericStringOrNumber)

    expect(() =>
      createPassphrase({ dataset, language, passLength: "-1", inputs: testData({}) }),
    ).toThrowError(errors.smallerThanOne)
    expect(() =>
      createPassphrase({ dataset, language, passLength: "1200", inputs: testData({}) }),
    ).toThrowError(errors.tooLong)

    expect(() =>
      createPassphrase({ dataset, language, passLength: "3", inputs: testData({}) }),
    ).toThrowError(errors.tooShort)

    /** Testing Numbers */
    expect(() =>
      createPassphrase({ dataset, language, passLength: -1, inputs: testData({}) }),
    ).toThrowError(errors.smallerThanOne)
    expect(() =>
      createPassphrase({ dataset, language, passLength: Infinity, inputs: testData({}) }),
    ).toThrowError(errors.tooLong)
    expect(() =>
      createPassphrase({ dataset, language, passLength: NaN, inputs: testData({}) }),
    ).toThrowError(errors.notNumericStringOrNumber)
  })
})

describe("Generated string includes certain characters based on user input", () => {
  it("Should include only characters", () => {
    const regExp = /^[a-zäö]+$/

    expect("jlkaäödjfjlaf").toMatch(regExp)
    expect(regExp.test("12jkasfäööä34")).toStrictEqual(false)
    expect(regExp.test("12jkasfä€öö.ä34_*")).toStrictEqual(false)

    expect(createPassphrase({ dataset, language, passLength: "10", inputs: testData({}) })).toMatch(
      regExp,
    )
  })

  it("Should include at least one uppercase character", () => {
    const regExp = /[A-ZÄÖ]/

    expect("jlkaÄödJfjlaf").toMatch(regExp)
    expect(regExp.test("12jkasfäööä34")).toStrictEqual(false)
    expect(regExp.test("12jkasfä€öö.ä34_*")).toStrictEqual(false)

    expect(
      createPassphrase({
        dataset,
        language,
        passLength: "10",
        inputs: testData({ uppercaseCharacters: true }),
      }),
    ).toMatch(regExp)
    expect(
      createPassphrase({
        dataset,
        language,
        passLength: "10",
        inputs: testData({ uppercaseCharacters: true }),
      }),
    ).toMatch(regExp)
  })

  it("Should include atleast one number", () => {
    const regExp = /\d/

    expect("jlkaäödjf53jlaf1").toMatch(regExp)
    expect(regExp.test("tämäontesti")).toStrictEqual(false)
    expect(regExp.test("tämä*ontes-ti")).toStrictEqual(false)

    expect(
      createPassphrase({
        dataset,
        language,
        passLength: "30",
        inputs: testData({ numbers: true }),
      }),
    ).toMatch(regExp)
    expect(
      createPassphrase({
        dataset,
        language,
        passLength: "4",
        inputs: testData({ word: true, numbers: true }),
      }),
    ).toMatch(regExp)
  })

  it("Should include specials", () => {
    const regExp = /[><,.\-_*?+\/()@%&!$€=#]/

    expect("jlk<aä.ödj-fjlaf").toMatch(regExp)
    expect("jlkaä$ödjfjlaf").toMatch(regExp)
    expect(regExp.test("thisisates2tstri4ng")).toStrictEqual(false)
    expect(regExp.test("tämäontesti")).toStrictEqual(false)

    expect(
      createPassphrase({
        dataset,
        language,
        passLength: "30",
        inputs: testData({ randomCharactersInString: true }),
      }),
    ).toMatch(regExp)
  })

  it("Should include numbers and specials", () => {
    const regExp = /^(?=.*[0-9])(?=.*[><,.\-_*?+\/()@%&!$€=#]).*$/

    expect("j9l0k<a5ä.ö1dj-fj6laf").toMatch(regExp)
    expect("j2lkaä€ödjfjlaf").toMatch(regExp)
    expect(regExp.test("thisisates2tstri4ng")).toStrictEqual(false)
    expect(regExp.test("tämäontesti")).toStrictEqual(false)
    expect(regExp.test("tämäon_testi")).toStrictEqual(false)

    // Characters
    expect(
      createPassphrase({
        dataset,
        language,
        passLength: "30",
        inputs: testData({ randomCharactersInString: true, numbers: true }),
      }),
    ).toMatch(regExp)

    // Words
    expect(
      createPassphrase({
        dataset,
        language,
        passLength: "5",
        inputs: testData({ word: true, randomCharactersInString: true, numbers: true }),
      }),
    ).toMatch(regExp)
  })
})

/**
 * We already check for inclusion of special characters and numbers in the previous tests
 * So only check for other passphrase related properties, like
 * - amount of words
 * - amount of special characters
 */
describe("Generated passphrase is valid", () => {
  it("Should have correct amount of words", () => {
    const splitter = "-"
    const passphrase = createPassphrase({
      dataset,
      language,
      passLength: "2",
      inputs: testData({
        word: true,
        inputFieldValueFromUser: splitter,
      }),
    })
    expect(passphrase).toContain(splitter)

    const splitStringArr = passphrase.split(splitter)
    expect(splitStringArr).toHaveLength(2)
  })

  it("Should have correct amount of splitter characters", () => {
    const splitter = "?"
    const regExp = /[?]/g
    const passphrase = createPassphrase({
      dataset,
      language,
      passLength: "3",
      inputs: testData({
        word: true,
        inputFieldValueFromUser: splitter,
      }),
    })
    expect(passphrase).toContain(splitter)

    const splitterArr = passphrase.match(regExp)
    expect(splitterArr).toStrictEqual(["?", "?"])
  })
})
