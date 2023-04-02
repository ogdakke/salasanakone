import { InputValues } from "../Components/form";
import { sanat } from "../sanat"

export interface checkboxes {
  passphrase?: boolean;
  uppercase?: boolean;
  randomChars?: boolean;
  numbers?: boolean;
  words?: boolean;
}

export default async function createCryptoKey(sliderValue: string, data: InputValues): Promise<string> {
  const arrayOfWords = sanat as string[]
  
  const USER_SPECIALS = data.randomChars.value


  const length = parseInt(sliderValue)

  const handleReturns = async (values: InputValues, length: number): Promise<string> => {
    async function handle(length: number) {
      // if words is true --->
      if (data.words.selected) {
        /*this is the string[] that is generated when data.words is true*/
        const wordString = (await getWordsWithObject(length, arrayOfWords))

        if (data.randomChars.value) {
          if (data.numbers.selected) {
            return insertRandomNumber(wordString, length).join(USER_SPECIALS)
          }
          return wordString.join(USER_SPECIALS)
        }
        if (data.numbers.selected) {
          const numberedArr = insertRandomNumber(wordString, length)
          
          return numberedArr.join("").toString()
        }
        return wordString.join("")
      } 
       // if words is false -------->
        else if (data.randomChars.selected && data.numbers.selected) {
          return createFromString(specialsAndNums)
        }
        else if (!data.numbers.selected && !data.randomChars.selected) {
          return createFromString(chars)
        }
        else if (data.numbers.selected) {
          return createFromString(charsWithNumbers)
        }
        else if (data.randomChars.selected) {
          return createFromString(charsAndSpecials)
        }
        
    } 

    // handle the handle :D
    const finalString = await handle(length).then((r) => {
      if (r === undefined) {
        throw ("undefined value for string")
      }
      return r.toString()
    })
    if (values.uppercase.selected && data.passphrase.selected) {
      return capitalizeFirstLetter(finalString).toString()
    } else if (values.uppercase.selected) {
      return toUppercase(finalString).toString()
    }
    return finalString
  }


  /**
   * Creates a randomised string of chars from a input string
   * @param stringToUse string that contains all the chars to generate the random string from
   * @returns randomized string
   */
  const createFromString = (stringToUse: string) => {
    const numArr = generateRandomArray(length, 0, stringToUse.length - 1)
    
    const charArr = stringToUse.split("")

    const str: string[] = []
    numArr.map((num, i) => {
      str.push(charArr[numArr[i]])
    })
    return str.join("")
  }

  return handleReturns(data, length)
}

/**
 * converts strings to uppercase
 * @param stringToUpper either a string or string[]
 * @returns uppercased string or string[]
 */
const toUppercase = (stringToUpper: string[]|string) => {
  
  const someCharToUpper = (someStr: string) => {
    const len = someStr.length
    // so that there is always at least ONE char left lowercase (of course not possible if contains nums or specials...) we do "len - 1" for the arrays length
    const arr = generateRandomArray(len - 1, 0, len)

    const strArr = someStr.split("")
    arr.forEach(i => {
      if (i < len) {
        strArr[i] = strArr[i].toUpperCase()
      }
    })
    return strArr.join("")
  }
  
  
  if (typeof(stringToUpper) === "string") {
    return someCharToUpper(stringToUpper)
    // return stringToUpper.toUpperCase()
  }
  const strArr: string[] = []
  stringToUpper.map((str) => {
    strArr.push(
      someCharToUpper(str)
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
 * @param {number} length how many numbers are in the array
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
  // console.time("length")
  const maxCount = sanat.length - 1 //the max word count in sanat.json
  
  // const then = performance.now()
  const randomNumsArray = generateRandomArray(length, 0, maxCount);
  
  const sanaArray: string[] = []
  
  for (const num of randomNumsArray) { 
    try {
      sanaArray.push(
        objektiSanat[num]
        )
      } catch (error) {
        // sometimes it returned undefined from the capitalizeFirstLetter function, so catch that here.
        throw console.error(error);
      }
  }
  // console.timeEnd("length")
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
  specials.split("").map(() => {
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
  
  return finalArr
}

function insertAtIndex(arr: string[], index: number, element: string) {
  arr.splice(index, 0, element);
  return arr;
}

const specialsAndNums = "abcdefghijklmnopqrstuyäöxz1234567890><,.-_*?+/()@%&!€=#"
const charsAndSpecials = "abcdefghijklmnopqrstuyäöxz><,.-_*?+/()@%&!€=#"
const charsWithNumbers = "abcdefghijklmnopqrstuyäöxz1234567890"
const chars = "abcdefghijklmnopqrstuyäöxz"
const specials = "><,.-_*?+/()@%&!€=#"