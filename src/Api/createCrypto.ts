import { type InputValueTypes } from "../Components/form";

// import { sanat } from "../sanat";

export interface checkboxes {
    uppercase?: boolean;
    randomChars?: boolean;
    numbers?: boolean;
    words?: boolean;
}

export default async function createCryptoKey(
    sliderValue: string,
    data: InputValueTypes,
): Promise<string> {
    // console.log("🚀 ~ file: createCrypto.ts:13 ~ createCryptoKey ~ data:", data)
    const sanatModule = await import("../sanat");
    const arrayOfWords = sanatModule.sanat;

    const USER_SPECIALS = data.randomChars.value;
    const length = parseInt(sliderValue);

    const handleReturns = (length: number) => {
        function handle(length: number): string {
            // if words is true --->
            if (data.words.selected) {
                /* this is the string[] that is generated when data.words is true */
                const wordString = getWordsWithObject(length, arrayOfWords);

                if (data.randomChars.value != null) {
                    if (data.numbers.selected) {
                        if (data.uppercase.selected) {
                            return insertRandomNumber(
                                capitalizeFirstLetter(wordString),
                                length,
                            ).join(USER_SPECIALS);
                        }
                        return insertRandomNumber(wordString, length).join(
                            USER_SPECIALS,
                        );
                    }
                    if (data.uppercase.selected) {
                        return capitalizeFirstLetter(wordString).join(
                            USER_SPECIALS,
                        );
                    }
                    return wordString.join(USER_SPECIALS);
                }
                if (data.numbers.selected) {
                    const numberedArr = insertRandomNumber(wordString, length);

                    return numberedArr.join("").toString();
                }
                if (data.uppercase.selected) {
                    return capitalizeFirstLetter(wordString).join("");
                }
                return wordString.join("");
            }
            // if words is false -------->
            else if (data.randomChars.selected && data.numbers.selected) {
                return createFromString(specialsAndNums);
            } else if (!data.numbers.selected && !data.randomChars.selected) {
                return createFromString(chars);
            } else if (data.numbers.selected) {
                return createFromString(charsWithNumbers);
            } else if (data.randomChars.selected) {
                return createFromString(charsAndSpecials);
            }
            return " ";
        }

        // handle the handle :D
        const finalString = handle(length);

        if (data.uppercase.selected && !data.words.selected) {
            return toUppercase(finalString).toString();
        }
        return finalString;
    };

    /**
     * Creates a randomised string of chars from a input string
     * @param stringToUse string that contains all the chars to generate the random string from
     * @returns randomized string
     */
    const createFromString = (stringToUse: string): string => {
        const numArr = generateRandomArray(length, 0, stringToUse.length - 1);

        const charArr = stringToUse.split("");

        const str: string[] = [];
        numArr.map((_num, i) => {
            return str.push(charArr[numArr[i]]);
        });
        return str.join("");
    };

    return handleReturns(length);
}

/**
 * converts strings to uppercase
 * @param stringToUpper either a string or string[]
 * @returns uppercased string or string[]
 */
const toUppercase = (stringToUpper: string[] | string): string | string[] => {
    const someCharToUpper = (someStr: string): string => {
        const len = someStr.length;
        // so that there is always at least ONE char left lowercase (of course not possible if contains nums or specials...) we do "len - 1" for the arrays length
        const arr = generateRandomArray(len - 1, 0, len);

        const strArr = someStr.split("");
        arr.forEach((i) => {
            if (i < len) {
                strArr[i] = strArr[i].toUpperCase();
            }
        });
        return strArr.join("");
    };

    if (typeof stringToUpper === "string") {
        return someCharToUpper(stringToUpper);
        // return stringToUpper.toUpperCase()
    }
    const strArr: string[] = [];
    stringToUpper.map((str) => {
        return strArr.push(someCharToUpper(str));
    });
    return strArr;
};

// Generate a random integer  with equal chance in  min <= r < max.     https://stackoverflow.com/questions/41437492/how-to-use-window-crypto-getrandomvalues-to-get-random-values-in-a-specific-rang
function generateRandomNumberInRange(min: number, max: number): number {
    const range = max - min;

    if (max <= min) {
        throw new Error("Max must be larger than min");
    }
    const requestBytes = Math.ceil(Math.log2(range) / 8);
    if (requestBytes === 0) {
        // No randomness required
        return 0;
    }
    const maxNum = Math.pow(256, requestBytes);
    const ar = new Uint8Array(requestBytes);

    let val: number;

    do {
        // Fill the typed array with cryptographically secure random values
        window.crypto.getRandomValues(ar);

        // Combine the array of random bytes into a single integer
        val = 0;
        for (let i = 0; i < requestBytes; i++) {
            val = (val << 8) + ar[i];
        }
    } while (val >= maxNum - (maxNum % range));

    // Return a random number within the specified range
    return min + (val % range);
}

/**
 * generates a array of random number
 * @param {number} length how many numbers are in the array
 * @returns array of numbers
 */
function generateRandomArray(
    length: number,
    min: number,
    max: number,
): number[] {
    const arr = [];
    for (let i = 0; i < length; i++) {
        const randomNumber = generateRandomNumberInRange(min, max);
        arr.push(...[randomNumber]);
    }
    return arr;
}

/**
 * capitalize any strings first letter
 * @param stringArrToConvert string[] to capitalize
 * @returns capitalised strings
 */
function capitalizeFirstLetter(stringArrToConvert: string[]): string[] {
    if (stringArrToConvert === undefined) {
        throw new Error("Virhe");
    }
    const convertedArr = stringArrToConvert.map((sana) => {
        return sana.charAt(0).toUpperCase() + sana.slice(1);
    });
    return convertedArr;
}

/**
 *
 * @param length length of the random number array that is passed in
 * @param objektiSanat the words as a array that are used to create phrases
 * @returns array of strings
 */
function getWordsWithObject(length: number, objektiSanat: string[]): string[] {
    // console.time("length")
    const maxCount = objektiSanat.length - 1; // the max word count in sanat.json

    // const then = performance.now()
    const randomNumsArray = generateRandomArray(length, 0, maxCount);

    const sanaArray: string[] = [];

    for (const num of randomNumsArray) {
        try {
            sanaArray.push(objektiSanat[num]);
        } catch (error) {
            // sometimes it returned undefined from the capitalizeFirstLetter function, so catch that here.
            console.error(error);
        }
    }
    // console.timeEnd("length")
    return sanaArray;
}

/**
 * adds a random char at the end of an array of strings
 * @param stringArr array of strings
 * @returns array of strings with random char
 */
// const randomCharsForJoins = (stringArr: string []) => {
//   const lastChar = (specials.length - 1)

//   const arr: string[] = []
//   specials.split('').map(() => {
//     const num = generateRandomNumberInRange(0, lastChar)
//     return arr.push(specials[num])
//   })

//   const arrWithChars: string[] = []

//   for (let i = 0; i < stringArr.length; i++) {
//     const muted = stringArr[i].concat(arr[i])
//     arrWithChars.push(muted)
//   }
//   return arrWithChars
// }

const insertRandomNumber = (
    stringArr: string[],
    sliderValue: number,
): string[] => {
    const finalArr = [];
    let mutated: string[] = [];
    let mutatedArr = "";

    try {
        for (let i = 0; i < sliderValue; i++) {
            const maxValue = stringArr[i].toString().length;
            const randomIndex = generateRandomNumberInRange(0, maxValue);
            const intToInsert = generateRandomNumberInRange(0, 9).toString();

            mutated = stringArr[i].split("");

            mutated = insertAtIndex(mutated, randomIndex, intToInsert);

            mutatedArr = mutated.join("");
            finalArr.push(mutatedArr);
        }
    } catch (err) {
        console.error(err);
    }

    return finalArr;
};

function insertAtIndex(
    arr: string[],
    index: number,
    element: string,
): string[] {
    arr.splice(index, 0, element);
    return arr;
}

const specialsAndNums =
    "abcdefghijklmnopqrstuyäöxz1234567890><,.-_*?+/()@%&!€=#";
const charsAndSpecials = "abcdefghijklmnopqrstuyäöxz><,.-_*?+/()@%&!€=#";
const charsWithNumbers = "abcdefghijklmnopqrstuyäöxz1234567890";
const chars = "abcdefghijklmnopqrstuyäöxz";
const specials = "><,.-_*?+/()@%&!€=#";
