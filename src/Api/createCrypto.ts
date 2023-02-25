import { fileRead } from "./getFile";

interface checkboxes {
  uppercase?: boolean;
  specialChars?: boolean;
  words?: boolean;
}

const specialCharacters = "!@$%&/()=?_-*><"
const file = "src/assets/sanat.json" //get words from here


const objektiSanat = await getFromFile(file)

export default async function createCryptoKey(sliderValue: string, data: checkboxes) {
  const arrayOfWords = objektiSanat as string[]
  
  let length = parseInt(sliderValue)
  
  if (!data.words) {
    return createPassWordFromRandomChars()
    
  }

  
  
  // return in uppercase if uppercase is true
  if (data.uppercase) {
    return data.words
    ? useUppercase(await getWordsWithObject(length, arrayOfWords))
    : createPassWordFromRandomChars()
    
  } else if (data.words) {
    return getWordsWithObject(length, arrayOfWords)
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
    return data.uppercase ? useUppercase(password) : password;
  }
}

const useUppercase = (stringToUpper: string) => {
  return stringToUpper.toUpperCase()
}


// Generate a random integer  with equal chance in  min <= r < max.     https://stackoverflow.com/questions/41437492/how-to-use-window-crypto-getrandomvalues-to-get-random-values-in-a-specific-rang
function generateRandomNumberInRange(): number {  
  const range = 94111; //length of items in sanat.json = number of words in the data
  if (range <= 0) {
    throw ('max must be larger than min');
  }
  let requestBytes = Math.ceil(Math.log2(range) / 8);
  if (!requestBytes) { // No randomness required
    return 0;
  }
  let maxNum = Math.pow(256, requestBytes);
  let ar = new Uint8Array(requestBytes);
  
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

/**
 * generates a array of random number
 * @param length how many numbers are in the array
 * @returns array of numbers
 */
function generateRandomArray(length: number): number[] {
  const arr = [];
  for (let i = 0; i < length; i++) {
    const randomNumber = generateRandomNumberInRange();
    arr.push(
      ...[randomNumber]
    );
  }
  return arr
}

/**
 * @notInUse this program uses getWordsWithObject
 * @param length how 
 * @returns Promise as a string
 */
export const getWordsWithMap = async (length: number): Promise<string> => {
  
  const sanat = await getFromFile(file);
  const mappi = new Map(Object.entries(sanat)) // tehdään mappi

  const then = performance.now() //start performance
  const randomNumsArray = generateRandomArray(length);  
  
  const sanaArray = []
  
  for (const num of randomNumsArray) {
    sanaArray.push(
      mappi.get(num.toString())
      )
    }
  const sanaJono = sanaArray.join("")
    
    
  const after = performance.now()
  console.log("🚀 ~ file: getList.ts:24 ~ getWithMap ~ time to do:", `${length} items in ${after-then} ms`)
  
  return sanaJono
}

/**
 * capitalize any strings first letter
 * @param string string to capitalize
 * @returns capitalised string
 */
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}






async function getWordsWithObject(length: number, objektiSanat: string[]) {
  
  // const then = performance.now()
  const randomNumsArray = generateRandomArray(length);

  const sanaArray: string[] = []
  
  for (const num of randomNumsArray) {
    
    sanaArray.push(
      capitalizeFirstLetter(objektiSanat[num])
      )
    }
    
  const sanaJono = sanaArray.join("")
    
    
  // const after = performance.now()
  // console.log("🚀 ~ file: getList.ts:24 ~ getWordsWithObject ~ time to do:", `${length} items in ${after-then} ms`)
    
  return sanaJono
}


/**
 * 
 * @param file the url to file 
 * @returns sanat which is from JSON.parce, hence the type "unknown"
 */
async function getFromFile(file: string) {
  const data = await JSON.parse(await fileRead(file))

  const sanat = {
    ...data
  };
  return sanat 
}
