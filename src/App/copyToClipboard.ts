export default async function copyToClipboard(valueToCopy: string): Promise<string> {
  const clipBoard = navigator.clipboard
  await clipBoard.writeText(valueToCopy)
  .then(() => {
    return valueToCopy 
  })
  .catch((err) => {
    console.error(err)
    return null
  })
  return valueToCopy
}