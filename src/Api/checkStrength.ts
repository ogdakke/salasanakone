const check = (await import("zxcvbn")).default
const sanat = await import("../sanat").then((r) => r.sanat)

export const checkStrength = async (password: string) => {
  return check(password, sanat)
}