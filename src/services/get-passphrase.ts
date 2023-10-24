import { isKey } from "@/common/utils/helpers"
import { ApiSalaCall, SalaApiResponse } from "../models"

const apiUrl = "https://www.salasanakone.com/api"

export async function getPassphrase({
  lang,
  passLength,
  inputValues,
}: ApiSalaCall): Promise<string | undefined> {
  const hasWords = inputValues.words.selected
  const hasNumbers = inputValues.numbers.selected
  const hasUppercase = inputValues.uppercase.selected
  const hasRandomChars = inputValues.randomChars.selected
  const separator = inputValues.randomChars.value

  const url = `${apiUrl.toString()}/?passLength=${passLength}&words=${hasWords}&numbers=${hasNumbers}&uppercase=${hasUppercase}&randomChars=${hasRandomChars}&randomCharsValue=${separator}`

  const payload = {
    lang: lang,
    passLength: passLength,
    numbers: hasNumbers,
    uppercase: hasUppercase,
    randomChars: hasRandomChars,
    separator: separator,
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error("Response body", await response.text())
      throw new Error(`API call failed with status: ${response.status}`)
    }

    const data = (await response.json()) as SalaApiResponse

    if (data && isKey(data, "passphrase") && Object.hasOwn(data, "passphrase")) {
      return data.passphrase
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("error fetching passphrase", error)
    }
  }
  return undefined
}
