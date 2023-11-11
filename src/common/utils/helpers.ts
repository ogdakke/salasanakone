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
 * @param len desired length
 * @param str string to check
 * @returns string, mutated or not
 */
const validateLength = (str: string, len: number): string => {
  let final = str
  if (str.length > len) {
    final = str.substring(0, len)
  }
  return final
}

function filterKey<T extends Record<PropertyKey, unknown>, K extends keyof T>(
  obj: T,
  key: K,
): Omit<T, K> {
  const { [key]: _, ...rest } = obj
  return rest
}

export { correctType, filterKey, isKey, validateLength }

