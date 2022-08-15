const consonants: string[] = [
  "b",
  "c",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "m",
  "n",
  "p",
  "q",
  "r",
  "s",
  "t",
  "v",
  "w",
  "x",
  "z",
];

const vowels: string[] = ["a", "e", "i", "o", "u", "y", "å", "ä", "ö"];

const diphthongs: string[] = [
  "ai",
  "ei",
  "oi",
  "äi",
  "öi",
  "ey",
  "äy",
  "öy",
  "au",
  "eu",
  "ou",
  "ui",
  "yi",
  "iu",
  "iy",
  "ie",
  "uo",
  "yö",
];

const oddCases: string[] = ["ys", "ar", "il"];

var checkPoint: number;
var saveSpecialCharacter: string[] = [];

// COLLECT AND CLUE TOGHETER SYLLABLES INTO AN ARRAY

interface ExtractorParameters {
  word: string;
  toggleDashes: boolean;
}

export const syllableExtractor = ({
  word,
  toggleDashes,
}: ExtractorParameters): string[] => {
  var hyphenatedWordInArray: string[] = [];
  var input: string = word;
  if (itIsSpecialChar(input[0])) {
    checkPoint += 1;
  }
  while (input.length > 0) {
    var firstHyphenLength = findFirstHyphen(input);
    var firstSyllable = input.substring(0, firstHyphenLength);
    hyphenatedWordInArray.push(firstSyllable);
    input = input.substring(firstHyphenLength, input.length);
  }

  if (toggleDashes === true) {
    const firstHyphen: string = hyphenatedWordInArray[0];
    const hyphenatedWordwithDashes: string[] = [];
    hyphenatedWordwithDashes.push(firstHyphen);
    hyphenatedWordInArray.forEach((element, index, array) => {
      if (index !== 0) {
        element = "-" + element;
        hyphenatedWordwithDashes.push(element);
      }
    });

    return hyphenatedWordwithDashes;
  }

  return hyphenatedWordInArray;
};

const findFirstHyphen = (input: string): number => {
  checkPoint = 2;
  var lettersToCheck: string;
  var foundHyphen: boolean = false;
  while (foundHyphen === false) {
    lettersToCheck = input.substring(checkPoint, checkPoint + 2);
    if (isItcuttingTime(lettersToCheck)) {
      foundHyphen = true;
    } else {
      checkPoint += 1;
    }
    // emergency break
    if (checkPoint > 10) {
      break;
    }
  }
  return checkPoint;
};

const itIsSpecialChar = (input: string): boolean => {
  const lettersOnly = /([a-zäöåA-ZÄÖÅ])/g;

  if (!lettersOnly.test(input)) {
    saveSpecialCharacter.push(input);
    console.log("special char: ", saveSpecialCharacter);
    return true;
  }
  return false;
};

// HYPHENATION RULES:

const isItcuttingTime = (input: string): boolean => {
  if (itIsConsonantAndVowel(input) || itIsVowelAndVowelAndDiphthong(input)) {
    return true;
  }
  return false;
};

const itIsConsonantAndVowel = (input: string): boolean => {
  if (vowels.includes(input[0]) && consonants.includes(input[1])) {
    if (oddCases.includes(input)) {
      checkPoint += 1;
      return false;
    }
    return true;
  }
  if (vowels.includes(input[1]) && consonants.includes(input[0])) {
    if (oddCases.includes(input)) {
      checkPoint += 1;
      return false;
    }
    return true;
  }
  if (consonants.includes(input[1]) && consonants.includes(input[0])) {
    return false;
  }
  return false;
};

const itIsVowelAndVowelAndDiphthong = (input: string): boolean => {
  if (vowels.includes(input[0]) && vowels.includes(input[1])) {
    if (diphthongs.includes(input)) {
      return true;
    }
  }
  return false;
};

export const getRandomArbitrary = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};
