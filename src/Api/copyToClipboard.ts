

export default async function copyToClipboard(valueToCopy: string): Promise<string> {
  writeToClipboard(valueToCopy)
  return valueToCopy
}

const writeToClipboard = async (value: string) => {
  const clipBoard = navigator.clipboard

  try {
    await clipBoard.writeText(value)
        
    return value 

  } catch (err) {
    console.error(err)
    return null
  }
}
