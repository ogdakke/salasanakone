

export default async function copyToClipboard(valueToCopy: string): Promise<string> {
  writeToClipboard(valueToCopy)
  return valueToCopy
}

const writeToClipboard = async (value: string) => {
  const clipBoard = navigator.clipboard

  try {
    const then = performance.now()
    await clipBoard.writeText(value)
    const after = performance.now()
    
    console.log(`${after-then} ms`);
    
    return value 

  } catch (err) {
    console.error(err)
    return null
  }
}
