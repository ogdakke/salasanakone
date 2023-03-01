import sanat from "/src/sanat.json"
interface checkboxes {
  uppercase?: boolean;
  randomChars?: boolean;
  words?: boolean;
}

export default async function createCryptoKey(sliderValue: string, data: checkboxes) {
  
  const arrayOfWords = sanat as string[]
  
  let length = parseInt(sliderValue)
  
  if (!data.words) {
    return createPassWordFromRandomChars()
    
  }
  
  // return in uppercase if uppercase is true
  if (data.uppercase) {
    if (data.randomChars) {
      return useUppercase(
        randomCharsForJoins(
          await getWordsWithObject(length, arrayOfWords)
        ).join("")
      )
    }
    return createPassWordFromRandomChars()
  } else if (data.words) {
    if (data.randomChars) {
      return randomCharsForJoins(
        await getWordsWithObject(length, arrayOfWords)
      ).join("")
    }
    return (await getWordsWithObject(length, arrayOfWords)).join("")

  } 
  return createPassWordFromRandomChars()
  

  /**
   * Creates a password from random chars and numbers
   * @returns string password
   */
  function createPassWordFromRandomChars() {    
    
    // convert number of characters to number of bytes
    const numOfBytes = Math.ceil(length = (+length || 8) / 2);
    
    // create a typed array of that many bytes
    const typdArray = new Uint8Array(numOfBytes);
    
    // populate it with crypto-random values
    window.crypto.getRandomValues(typdArray);
    
    // convert it to an Array of Strings (e.g. "01", "AF", ..)
    const toStringArray = (password: string) => {
      return '00'.slice(password.length) + password;
    };
    const a = Array.prototype.map.call(typdArray, (index: number) => {
      // 26 is the radix, which dictates to what base the numbers are converted as strings.   
      const str = index.toString(26);
      return toStringArray(str);
    });
    let password = a.join('');

    // and snip off the excess digit if we want an odd number
    // here, if length % 2 returns a value !0 we slice last digit
    length % 2 && length !== 2 ? password = password.slice(1) : password;
    return data.uppercase ? useUppercase(password).toString() : password;
  }
}

/**
 * converts strings to uppercase
 * @param stringToUpper either a string or string[]
 * @returns uppercased string or string[]
 */
const useUppercase = (stringToUpper: string[]|string) => {
  if (typeof(stringToUpper) === "string") {
    return stringToUpper.toUpperCase()
  }
  const strArr: string[] = []
  stringToUpper.map((str) => {
    strArr.push(
      str.toUpperCase()
    )
  })
  return strArr
}


// Generate a random integer  with equal chance in  min <= r < max.     https://stackoverflow.com/questions/41437492/how-to-use-window-crypto-getrandomvalues-to-get-random-values-in-a-specific-rang
function generateRandomNumberInRange(min: number, max: number): number {  
  const range = max-min; 
  if (max <= 0) {
    throw ('max must be larger than min');
  }
  const requestBytes = Math.ceil(Math.log2(range) / 8);
  if (!requestBytes) { // No randomness required
    return 0;
  }
  const maxNum = Math.pow(256, requestBytes);
  const ar = new Uint8Array(requestBytes);
  
  while (true) {
      window.crypto.getRandomValues(ar);

      let val = 0;
      for (let i = 0; i < requestBytes;i++) {
          val = (val << 8) + ar[i];
      }
      
      if (val < maxNum - maxNum % range) {
        return 0 + (val % range);
      }
      
    }
}

const min = 0
const max = 94111 //the max word count in sanat.json
/**
 * generates a array of random number
 * @param length how many numbers are in the array
 * @returns array of numbers
 */
function generateRandomArray(length: number): number[] {
  const arr = [];
  for (let i = 0; i < length; i++) {
    const randomNumber = generateRandomNumberInRange(min, max);
    arr.push(
      ...[randomNumber]
    );
  }
  return arr
}



/**
 * capitalize any strings first letter
 * @param string string to capitalize
 * @returns capitalised string
 */
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}





/**
 * 
 * @param length length of the random number array that is passed in
 * @param objektiSanat the words as a array that are used to create phrases
 * @returns array of strings
 */
async function getWordsWithObject(length: number, objektiSanat: string[]) {
  
  // const then = performance.now()
  const randomNumsArray = generateRandomArray(length);

  const sanaArray: string[] = []
  
  for (const num of randomNumsArray) { 
    sanaArray.push(
      capitalizeFirstLetter(objektiSanat[num])
      )
  }
    
  return sanaArray
}

/**
 * adds a random char at the end of an array of strings
 * @param stringArr array of strings
 * @returns array of strings with random char
 */
const randomCharsForJoins = (stringArr: string []) => {
  const lastChar = (specials.length - 1)
  
  const arr: string[] = []
  specials.map(() => {
    const num = generateRandomNumberInRange(0, lastChar)
    
    arr.push(specials[num])
  }) 

  const arrWithChars: string[] = []

  for (let i = 0; i < stringArr.length; i++) {
    const muted = stringArr[i].concat(arr[i])
    arrWithChars.push(muted)
    
  }
  return arrWithChars
}


// /**
//  * @notInUse this program uses getWordsWithObject
//  * @param length how 
//  * @returns Promise as a string
//  */
// export const getWordsWithMap = async (length: number): Promise<string> => {
  
//   // const sanat = await getFromFile(file);
//   const mappi = new Map(Object.entries(sanat)) // tehdään mappi

//   const then = performance.now() //start performance
//   const randomNumsArray = generateRandomArray(length);  
  
//   const sanaArray = []
  
//   for (const num of randomNumsArray) {
//     sanaArray.push(
//       mappi.get(num.toString())
//       )
//     }
//   const sanaJono = sanaArray.join("")
    
    
//   const after = performance.now()
//   console.log("🚀 ~ file: getList.ts:24 ~ getWithMap ~ time to do:", `${length} items in ${after-then} ms`)
  
//   return sanaJono
// }

const specials = [
  ",",
  "-",
  "_",
  "*",
  "?",
  "+",
  "=",
  "(",
  ")",
  "/",
  "!",
  "@",
  "%",
  "&",
  ">",
  "<",
]