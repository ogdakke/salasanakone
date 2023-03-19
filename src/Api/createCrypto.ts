import { sanat } from "../sanat"

export interface checkboxes {
  uppercase?: boolean;
  randomChars?: boolean;
  numbers?: boolean;
  words?: boolean;
}

export default async function createCryptoKey(sliderValue: string, data: checkboxes): Promise<string> {
  const arrayOfWords = sanat as string[]
  
  let length = parseInt(sliderValue)
  
  
  const handleReturns = async (values: checkboxes, length: number): Promise<string> => {
    async function handle(values: checkboxes, length: number) {
      if (data.words) {
        /*this is the string[] that is generated when data.words is true*/
        const wordString = (await getWordsWithObject(length, arrayOfWords))

        if (data.randomChars) {
          if (data.numbers) {
            return randomCharsForJoins(
              insertRandomNumber(wordString, length)
            ).join("")
          }
          return randomCharsForJoins(wordString).join("")
        }
        if (data.numbers) {
          const numberedArr = insertRandomNumber(wordString, length)
          
          return numberedArr.join("").toString()
        }
        return wordString.join("")
      } 
        else if (data.uppercase) {
        const passFromRndmChars = createPassWordFromRandomChars()
        return toUppercase(passFromRndmChars).toString()
      } 
      else if (!data.uppercase) {
        return createPassWordFromRandomChars()
      } 
    }
    const finalString = await handle(values, length).then((r) => {
      if (r === undefined) {
        throw ("undefined value for string")
      }
      return r.toString()
    })
    if (values.uppercase) {
      return toUppercase(finalString).toString()
    }
    return finalString
  }



  const createFromAllChars = () => {
    const arr = generateRandomArray(length, 0, withSpecials.length)
    console.log("🚀 ~ file: createCrypto.ts:61 ~ createFromAllChars ~ arr:", arr)
  }
  createFromAllChars()
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
    return data.uppercase ? toUppercase(password).toString() : password;
  }

  return handleReturns(data, length)
}

/**
 * converts strings to uppercase
 * @param stringToUpper either a string or string[]
 * @returns uppercased string or string[]
 */
const toUppercase = (stringToUpper: string[]|string) => {
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
  if (max <= min) {
    throw ('max must be larger than min');
  }
  const requestBytes = Math.ceil(Math.log2(range) / 8);
  if (!requestBytes) { // No randomness required
    return 0;
  }
  const maxNum = Math.pow(256, requestBytes);
  const ar = new Uint8Array(requestBytes);
  
  while (true) {
    // I dont understand this shit
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

/**
 * generates a array of random number
 * @param length how many numbers are in the array
 * @returns array of numbers
 */
function generateRandomArray(length: number, min: number, max: number): number[] {
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
 * @param stringToConvert string to capitalize
 * @returns capitalised string
 */
function capitalizeFirstLetter(stringToConvert: string): string {
  if (stringToConvert === undefined) {
    throw "Virhe"
  }
  return stringToConvert.charAt(0).toUpperCase() + stringToConvert.slice(1);
}



/**
 * 
 * @param length length of the random number array that is passed in
 * @param objektiSanat the words as a array that are used to create phrases
 * @returns array of strings
 */
async function getWordsWithObject(length: number, objektiSanat: string[]): Promise<string[]> {
  const maxCount = 94111 //the max word count in sanat.json
  
  // const then = performance.now()
  const randomNumsArray = generateRandomArray(length, 0, maxCount);

  const sanaArray: string[] = []
  
  for (const num of randomNumsArray) { 
    try {
      sanaArray.push(
        capitalizeFirstLetter(objektiSanat[num])
        )
    } catch (error) {
      // sometimes it returned undefined from the capitalizeFirstLetter function, so catch that here.
      throw console.error(error);
    }
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


const insertRandomNumber = (stringArr: string[], sliderValue: number): string[] => {
  const then = performance.now()

  
  const finalArr = []
  let mutated: string[] = []
  let mutatedArr = ""
  
  try {
    for (let i = 0; i < sliderValue; i++) {
      const maxValue = stringArr[i].toString().length
      const randomIndex = generateRandomNumberInRange(0, maxValue)
      const intToInsert = generateRandomNumberInRange(0, 9).toString()
      
      mutated = stringArr[i].split("")
      
      mutated = insertAtIndex(mutated, randomIndex, intToInsert)
      
      mutatedArr = mutated.join("")
      finalArr.push(mutatedArr)
    }
  } catch (err) {
    throw console.error(err);
  }
  
  const now = performance.now()
  // console.log("🚀 ~ file: createCrypto.ts:248 ~ insertRandomNumber ~ now:", now - then, "ms")
  return finalArr
}

function insertAtIndex(arr: string[], index: number, element: string) {
  arr.splice(index, 0, element);
  return arr;
}


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

const withSpecials = "abcdefghjiklmopqrstuyäözx1234567890><,.-_*?+/()@%&!"
