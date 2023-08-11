export function isKey<T extends object>(x: T, k: PropertyKey): k is keyof T {
  return k in x
}

export function correctType(arg: unknown, desiredType: unknown): boolean {
  const isType = typeof arg
  if (isType === desiredType) {
    // console.log("Type does match", isType, " is ", desiredType);
    return true
  } else {
    console.error("Type does not match", isType, " is not ", desiredType)
    return false
  }
}
