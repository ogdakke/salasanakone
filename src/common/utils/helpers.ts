function isKey<T extends object>(x: T, k: PropertyKey): k is keyof T {
  return k in x
}

function correctType(arg: unknown, desiredType: unknown): boolean {
  const isType = typeof arg
  if (isType === desiredType) {
    // console.log("Type does match", isType, " is ", desiredType);
    return true
  } else {
    console.error("Type does not match", isType, " is not ", desiredType)
    return false
  }
}

/**
 * returns a substring of desired length {length} if str is longer than {length}
 * @param length desired length
 * @param str string to check
 * @returns string, mutated or not
 */
const validateLength = (str: string, length: number): string => {
  let final = str
  if (str.length > length) {
    final = str.substring(0, length)
    // console.log(`Checked string of length ${final.length}`)
  }
  // console.log(`Checked string of length ${final.length}`)
  return final
}

export { correctType, isKey, validateLength }

