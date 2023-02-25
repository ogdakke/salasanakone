
export function passwordGenerator(length: number): string{
  if (!length) {
    console.log("no length provided");
    return "no length"
  } 

  const password = Math.random().toString().split(".")[1]

  const correct = isCorrectLength(password, length)
  
  console.log("🚀 ~ file: createPassword.ts:11 ~ passwordGenerator ~ password", correct)
  console.log("🚀 ~ file: createPassword.ts:13 ~ passwordGenerator ~ password", correct.length)
  
  return correct
}

const isCorrectLength = (password: string, length: number): string => {
  if (password.length === length) {
    console.log("sama");    
    return password
  } else if (password.length >= length) {
    console.log("pitkä");
    return shorten(password, length)
  } 
  console.log("lyhyt");
  return lengthen(password, length)
} 

function lengthen(password: string, length: number): string {
  const pad = Math.random().toString().split(".")[1]
  
  const lengthened = password.padEnd(length, pad)
  console.log("🚀 ~ file: createPassword.ts:35 ~ lengthen ~ password", password)
  return lengthened
}

function shorten(password: string, length: number): string {
  const shortened = password.slice(0, length)
  console.log("🚀 ~ file: createPassword.ts:41 ~ shorten ~ password", password)
  return shortened
}
