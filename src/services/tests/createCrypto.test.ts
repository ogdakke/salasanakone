import { describe, expect, it } from "vitest"
import { maxLengthForChars, minLengthForChars } from "../../config"
import { InputType, PassCreationRules } from "../../models"
import { createCryptoKey } from "../createCrypto"

type TestConfig = {
  word?: boolean
  randomCharactersInString?: boolean
  numbers?: boolean
  uppercaseCharacters?: boolean
  inputType?: InputType
  inputFieldValueFromUser?: string
}

const defaultConfig: TestConfig = {
  word: false,
  randomCharactersInString: false,
  numbers: false,
  uppercaseCharacters: false,
  inputType: "checkbox",
  inputFieldValueFromUser: "-",
}

const testData = (config: TestConfig = {}): PassCreationRules => {
  const {
    word,
    randomCharactersInString,
    numbers,
    uppercaseCharacters,
    inputType: input,
    inputFieldValueFromUser,
  } = { ...defaultConfig, ...config } // Merge default values with provided ones
  return {
    words: {
      inputType: "radio",
      info: "placeholder info",
      selected: word || false, //If this is false, it will return a random string of characters
      value: "",
    },
    randomChars: {
      inputType: input || "input",
      info: "placeholder info",
      selected: randomCharactersInString || false,
      value: inputFieldValueFromUser, //this only should apply if word === true
    },
    uppercase: {
      inputType: "checkbox",
      info: "placeholder info",
      selected: uppercaseCharacters || false,
      value: "",
    },
    numbers: {
      inputType: "checkbox",
      info: "placeholder info",
      selected: numbers || false,
      value: "",
    },
  }
}

describe("createCryptoKey creates a random string with correct length", () => {
  it("should return a string with length 10", () => {
    expect(createCryptoKey("10", testData())).toHaveLength(10)
    expect(createCryptoKey("10", testData({ randomCharactersInString: true }))).toHaveLength(10)
    expect(createCryptoKey("10", testData({ numbers: true }))).toHaveLength(10)
  })

  it("should return a string with length maxLengthForChars", () => {
    expect(createCryptoKey(maxLengthForChars.toString(), testData())).toHaveLength(64)
  })

  it("should not return a string with weird values", () => {
    expect(() => createCryptoKey("-1", testData())).toThrowError(
      "Value must be a positive number larger than 0",
    )
    expect(() => createCryptoKey("huh", testData())).toThrowError("Value must be a numeric string")
    expect(() => createCryptoKey("007A", testData())).toThrowError("Value must be a numeric string")

    expect(() => createCryptoKey("1200", testData())).toThrowError(
      `Value must not exceed ${maxLengthForChars}`,
    )

    expect(() => createCryptoKey("3", testData())).toThrowError(
      `Value cannot be smaller than ${minLengthForChars}`,
    )

    // @ts-expect-error testing non-string value
    expect(() => createCryptoKey(NaN, testData())).toThrowError("Value must be a numeric string")
    // @ts-expect-error testing nullish values
    expect(() => createCryptoKey(null, testData())).toThrowError(
      "Value cannot be undefined or null",
    )
    // @ts-expect-error testing nullish values
    expect(() => createCryptoKey(undefined, testData())).toThrowError(
      "Value cannot be undefined or null",
    )
  })
})

describe("Generated string includes certain characters based on user input", () => {
  it("Should include only characters", () => {
    const regExp = /^[a-zäö]+$/

    expect("jlkaäödjfjlaf").toMatch(regExp)
    expect(regExp.test("12jkasfäööä34")).toStrictEqual(false)
    expect(regExp.test("12jkasfä€öö.ä34_*")).toStrictEqual(false)

    expect(createCryptoKey("10", testData())).toMatch(regExp)
  })

  it("Should include at least one uppercase character", () => {
    const regExp = /[A-ZÄÖ]/

    expect("jlkaÄödJfjlaf").toMatch(regExp)
    expect(regExp.test("12jkasfäööä34")).toStrictEqual(false)
    expect(regExp.test("12jkasfä€öö.ä34_*")).toStrictEqual(false)

    expect(
      async () => await createCryptoKey("10", testData({ uppercaseCharacters: true })),
    ).toMatch(regExp)
    expect(
      async () => await createCryptoKey("3", testData({ word: true, uppercaseCharacters: true })),
    ).toMatch(regExp)
  })

  it("Should include atleast one number", () => {
    const regExp = /\d/

    expect("jlkaäödjf53jlaf1").toMatch(regExp)
    expect(regExp.test("tämäontesti")).toStrictEqual(false)
    expect(regExp.test("tämä*ontes-ti")).toStrictEqual(false)

    expect(async () => await createCryptoKey("30", testData({ numbers: true }))).toMatch(regExp)
    expect(async () => await createCryptoKey("4", testData({ word: true, numbers: true }))).toMatch(
      regExp,
    )
  })

  it("Should include specials", () => {
    const regExp = /[><,.\-_*?+\/()@%&!$€=#]/

    expect("jlk<aä.ödj-fjlaf").toMatch(regExp)
    expect("jlkaä$ödjfjlaf").toMatch(regExp)
    expect(regExp.test("thisisates2tstri4ng")).toStrictEqual(false)
    expect(regExp.test("tämäontesti")).toStrictEqual(false)

    expect(
      async () => await createCryptoKey("30", testData({ randomCharactersInString: true })),
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
      async () =>
        await createCryptoKey("30", testData({ randomCharactersInString: true, numbers: true })),
    ).toMatch(regExp)

    // Words
    expect(() =>
      createCryptoKey("5", testData({ word: true, randomCharactersInString: true, numbers: true })),
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
  it("Should have correct amount of words", async () => {
    const splitter = "-"
    const passphrase = await createCryptoKey(
      "2",
      testData({
        word: true,
        inputFieldValueFromUser: splitter,
      }),
    )
    expect(passphrase).toContain(splitter)

    const splitStringArr = passphrase.split(splitter)
    expect(splitStringArr).toHaveLength(2)
  })

  it("Should have correct amount of splitter characters", async () => {
    const splitter = "?"
    const regExp = /[?]/g
    const passphrase = await createCryptoKey(
      "3",
      testData({
        word: true,
        inputFieldValueFromUser: splitter,
      }),
    )
    expect(passphrase).toContain(splitter)

    const splitterArr = passphrase.match(regExp)
    expect(splitterArr).toStrictEqual(["?", "?"])
  })
})
