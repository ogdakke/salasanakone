import { ApiSalaCall } from "../models"

const apiUrl = "https://api.salasanakone.com"

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

  const url = `${apiUrl}/?
    passLength=${passLength}
    &words=${hasWords}  
    &numbers=${hasNumbers}
    &uppercase=${hasUppercase}
    &randomChars=${hasRandomChars}
    &randomCharsValue=${randomCharsValue}
  `

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        // If you need to send authentication headers or any other headers, add them here
        "X-API-KEY": import.meta.env["VITE-X-API-KEY"],
      },
    })

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`)
    }

    const data = await response.json().then((res) => JSON.parse(res))

    // Assuming the API returns a field named "passphrase"
    if (typeof data === "object" && Object.hasOwn(data, "passphrase")) {
      console.log(data)
      return data.passphrase
    }
    console.log("--------", data)
  } catch (error) {
    console.error("Error fetching passphrase:", error)
    throw error
  }
  return undefined
}
