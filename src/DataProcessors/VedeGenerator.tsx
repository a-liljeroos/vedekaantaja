import { syllableExtractor } from "./metadata/metadata";

export const createVedeKieli = (input: string, toggleDashes: boolean) => {
  const userInputText: string = input;
  if (userInputText.length < 400) {
    var wordsSeparatedArray: string[] = userInputText
      .split(" ")
      .filter(function (e) {
        if (e.length > 1 && e !== " ") {
          return e;
        }
      });

    var translatedTextArray: string[] = [];
    wordsSeparatedArray.forEach((element, index, array) => {
      translatedTextArray.push(translateWord(element, toggleDashes));
    });

    const translatedText: string = translatedTextArray.join(" ");
    return translatedText;
  }

  return (
    "Liian pitkä teksti. Maksimimäärä: 400 merkkiä. Merkkejä käytetty: " +
    userInputText.length
  );
};

const translateWord = (word: string, toggleDashes: boolean): string => {
  const word2 = syllableExtractor({
    word: word,
    toggleDashes: toggleDashes,
  });

  if (toggleDashes === false) {
    return translateToVedekieli(word2);
  }

  return word2.join("");
};

const translateToVedekieli = (inputArray: string[]) => {
  const wordLength = inputArray.join("").length;
  const firstSyllable = inputArray[0].toLowerCase();
  const restOfWord = inputArray
    .join("")
    .substring(firstSyllable.length, wordLength)
    .toLowerCase();
  const vedeWord = "ve" + restOfWord + firstSyllable + "de";
  return vedeWord;
};
