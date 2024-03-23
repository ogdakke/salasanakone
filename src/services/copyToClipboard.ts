export default async function copyToClipboard(valueToCopy: string): Promise<string> {
  await writeToClipboard(valueToCopy)
  return valueToCopy
}

const writeToClipboard = async (value: string) => {
  if (navigator != null) {
    const clipBoard = navigator.clipboard
    try {
      await clipBoard.writeText(value)
      return value
    } catch (err) {
      console.error(err)
      return value
    }
  } else {
    new Error("No navigator detected")
    return undefined
  }
}
