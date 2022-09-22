import finFlag from "./fin-flag.png";
import engFlag from "./eng-flag.png";

export type InterfaceLanguage = {
  language: string;
  flag: string;
  front: {
    mode: {
      vedelang: string;
      hyphenate: string;
    };
    emptyButton: string;
    textInput: string;
  };
  back: {
    box1: string;
    box2: string;
    box3: string;
    moreInfo: string;
    sourceButton: string;
  };
};

const finnish: InterfaceLanguage = {
  language: "Suomi",
  flag: finFlag,
  front: {
    mode: {
      vedelang: "VEDEKIELI",
      hyphenate: "TAVUTUS (kokeellinen)",
    },
    emptyButton: "Tyhjennä",
    textInput: "Kirjoita jotain...",
  },
  back: {
    box1: "Vedekieli tai vedenkieli on leikkikieli, joka oli yleinen erityisesti 1950-luvun Helsingissä. Lue lisää:",
    box2: "Äänivaihtoehtojen määrä vaihtelee selaimen mukaan.",
    box3: "Puhesyntetisaattori ei välttämättä toimi kaikilla selaimilla.",
    moreInfo: "Lisätietoa",
    sourceButton: "Lähdekoodi",
  },
};

const english: InterfaceLanguage = {
  language: "English",
  flag: engFlag,
  front: {
    mode: {
      vedelang: "VEDELANGUAGE",
      hyphenate: "HYPHENATE (experimental)",
    },
    emptyButton: "Clear",
    textInput: "Write something...",
  },
  back: {
    box1: "Vede language is children's secret language that was popular in 1950s in Helsinki. Read more:",
    box2: "Voice options vary between browsers.",
    box3: "Speech synthesis might not work with all browsers.",
    moreInfo: "Read more",
    sourceButton: "Sourcecode",
  },
};

export const languages: InterfaceLanguage[] = [finnish, english];
