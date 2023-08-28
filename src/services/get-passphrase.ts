import { ApiSalaCall } from "../models"
import { isKey } from "../utils/helpers"

const apiUrl = "https://api.salasanakone.com"

export interface SalaApiResponse {
  passphrase: string
  passLength: number
}

export async function getPassphrase({
  lang,
  passLength,
  inputValues,
}: ApiSalaCall): Promise<string | undefined> {
  const hasWords = inputValues.words.selected
  const hasNumbers = inputValues.numbers.selected
  const hasUppercase = inputValues.uppercase.selected
  const hasRandomChars = inputValues.randomChars.selected
  const randomCharsValue = inputValues.randomChars.value

  const url = `${apiUrl}/?passLength=${passLength}&words=${hasWords}&numbers=${hasNumbers}&uppercase=${hasUppercase}&randomChars=${hasRandomChars}&randomCharsValue=${randomCharsValue}`

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        // If you need to send authentication headers or any other headers, add them here
        "X-API-KEY": import.meta.env["VITE_X_API_KEY"],
      },
    })

    if (!response.ok) {
      console.error("Response body", await response.text())
      throw new Error(`API call failed with status: ${response.status}`)
    }

    const data = (await response.json()) as SalaApiResponse

    // Assuming the API returns a field named "passphrase"
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
