function isKey<T extends object>(x: T, k: PropertyKey): k is keyof T {
  return k in x
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

function filterKey<T extends Record<PropertyKey, unknown>, K extends keyof T>(
  obj: T,
  key: K,
): Omit<T, K> {
  const { [key]: _, ...rest } = obj
  return rest
}

export { filterKey, isKey, validateLength }
