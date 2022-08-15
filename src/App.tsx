import React, { useEffect, useState } from "react";
import "./Layout/App.scss";
import { createVedeKieli } from "./DataProcessors/VedeGenerator";
import { GiSpeaker } from "react-icons/gi";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { GrStatusDisabledSmall } from "react-icons/gr";
import { RiFolderInfoLine } from "react-icons/ri";
import { CgClose } from "react-icons/cg";
import { getRandomArbitrary } from "./DataProcessors/metadata/metadata";

function App() {
  const [firstTextAreaValue, setFirstTextAreaValue] = useState("");
  const [secondTextAreaValue, setSecondTextAreaValue] = useState("");
  const [toggleDashes, setToggleDashes] = useState(false);
  const [switchMode, setSwitchMode] = useState(toggleDashes);

  // voices
  let speechSynthRef = React.useRef(window.speechSynthesis);

  const [currentVoiceLang, setCurrentVoiceLang] = useState("");
  const [currentVoiceNumber, setCurrentVoiceLangNumber] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>();
  const utter = new SpeechSynthesisUtterance(secondTextAreaValue);

  useEffect(() => {
    if (typeof speechSynthesis === "undefined") {
      setCurrentVoiceLang("Kuuntelu ei käytössä");
      return;
    }
    const allVoicesObtained = new Promise<SpeechSynthesisVoice[]>(function (
      resolve
    ) {
      let voices = window.speechSynthesis.getVoices();
      if (voices.length !== 0) {
        resolve(voices);
      } else {
        window.speechSynthesis.addEventListener("voiceschanged", function () {
          voices = window.speechSynthesis.getVoices();
          resolve(voices);
        });
      }
    });

    allVoicesObtained.then((voices: SpeechSynthesisVoice[]) => {
      setVoices(voices);
      console.log(voices);
      voices.filter(function (voice, index) {
        if (voice.lang.includes("fi")) {
          setCurrentVoiceLang(voice.lang);
          setCurrentVoiceLangNumber(index);
          utter.voice = voices[index];
        }
      });
      if (voices.length === 0) {
        utter.voice = voices[0];
        setCurrentVoiceLang(utter.voice.lang);
      }
    });
  }, []);

  //---------------------------------------------------------------------
  // Voice Buttons
  //---------------------------------------------------------------------

  const speakVoice = () => {
    stopSpeakVoice();
    if (firstTextAreaValue.length !== 0 && toggleDashes === false) {
      if (voices) {
        utter.voice = voices[currentVoiceNumber];
        speechSynthRef.current.speak(utter);
      }
    }
    showHelper("textarea-empty");
  };

  const stopSpeakVoice = () => {
    speechSynthRef.current.cancel();
    showHelper("textarea-empty");
  };

  const randomVoice = () => {
    if (toggleDashes === false && firstTextAreaValue.length !== 0 && voices) {
      stopSpeakVoice();
      const randomNumber = getRandomArbitrary(0, voices.length);
      utter.voice = voices[randomNumber];
      setCurrentVoiceLangNumber(randomNumber);
      setCurrentVoiceLang(utter.voice.lang);
      speechSynthRef.current.speak(utter);
    }
    showHelper("textarea-empty");
  };

  const isVoiceAvailable = (): boolean => {
    if (voices?.length !== 0) {
      return true;
    }
    return false;
  };

  //---------------------------------------------------------------------
  // Input handlers
  //---------------------------------------------------------------------

  const onChangeHandlerInput = (targetValue: string) => {
    if (targetValue.length < 400) {
      setFirstTextAreaValue(targetValue);
      if (targetValue.length < 1) {
        emptyTextField();
      }

      const translatedText = createVedeKieli(targetValue, toggleDashes);
      setSecondTextAreaValue(translatedText);
    } else {
      setSecondTextAreaValue(
        "Liian pitkä teksti. Maksimimäärä: 400 merkkiä. Merkkejä käytetty: " +
          targetValue.length
      );
    }
  };

  const onChangeHanderToggle = () => {
    const translatedText = createVedeKieli(firstTextAreaValue, !toggleDashes);
    setSecondTextAreaValue(translatedText);
  };

  const emptyTextField = () => {
    setFirstTextAreaValue("");
    setSecondTextAreaValue("");
  };

  //---------------------------------------------------------------------
  // Info
  //---------------------------------------------------------------------

  const [flipMachine, setFlipMachine] = useState(true);

  const showInfo = () => {
    setFlipMachine(!flipMachine);
  };

  const [helper, setHelper] = useState("");

  const showHelper = (helpClass: string) => {
    if (firstTextAreaValue.length === 0 && helper === "") {
      if (toggleDashes === false) {
        setHelper(helpClass);
        const timer = setInterval(function () {
          setHelper("");
          clearInterval(timer);
        }, 400);
      }
    }
  };

  return (
    <>
      <main>
        <div className="machine">
          {flipMachine ? (
            <div className="front-side">
              <div className="result-container">
                <p className="null-textarea no-user-input">
                  {secondTextAreaValue}
                </p>
              </div>
              <div className="options">
                <div className="option">
                  <div className="switch-container">
                    <label className="switch">
                      <input
                        type="checkbox"
                        onClick={() => {
                          setToggleDashes(!toggleDashes);
                          setSwitchMode(!toggleDashes);
                          onChangeHanderToggle();
                        }}
                        value="on"
                      />
                      <span className="slider round"></span>
                    </label>

                    <div className="machine-state">
                      <div className="blur-box" />
                      <div className="pixels" />

                      {switchMode ? (
                        <h4>TAVUTUS (KOKEELLINEN)</h4>
                      ) : (
                        <>
                          <h4>VEDEKIELI{" - " + currentVoiceLang} </h4>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="button-container">
                  <button onClick={() => emptyTextField()}>Tyhjennä</button>
                  <div className="button-group-voice">
                    <button
                      onClick={() => speakVoice()}
                      className={`listen-btn button-group ${
                        toggleDashes && isVoiceAvailable()
                          ? "button-disabled"
                          : ""
                      }`}
                    >
                      <GiSpeaker size={28} color={"rgb(31, 31, 31)"} />
                    </button>

                    <button
                      onClick={() => stopSpeakVoice()}
                      className={`stop-btn button-group ${
                        toggleDashes && isVoiceAvailable()
                          ? "button-disabled"
                          : ""
                      }`}
                    >
                      <GrStatusDisabledSmall
                        size={18}
                        color={"rgb(31, 31, 31)"}
                      />
                    </button>
                    <button
                      onClick={() => randomVoice()}
                      className={`random-btn button-group ${
                        toggleDashes && isVoiceAvailable()
                          ? "button-disabled"
                          : ""
                      }`}
                    >
                      <GiPerspectiveDiceSixFacesRandom
                        size={28}
                        color={"rgb(31, 31, 31)"}
                      />
                    </button>
                    <button
                      onClick={() => {
                        showInfo();
                      }}
                      className={`info-btn button-group`}
                    >
                      <RiFolderInfoLine size={25} color={"rgb(31, 31, 31)"} />
                    </button>
                  </div>
                </div>
                <textarea
                  placeholder="Kirjoita jotain..."
                  spellCheck={false}
                  cols={30}
                  rows={8}
                  onChange={(e) => onChangeHandlerInput(e.target.value)}
                  value={firstTextAreaValue}
                  className={`${helper} `}
                ></textarea>
              </form>
            </div>
          ) : (
            <div className="back-side">
              <div
                className="close-info-btn"
                onClick={() => {
                  showInfo();
                }}
              >
                {" "}
                <CgClose size={35} color={"rgb(31, 31, 31)"} />
              </div>
              <InfoContainer />
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default App;

const InfoContainer = () => {
  return (
    <>
      <div className="info-container">
        <div className="info-text-container">
          <p className="info-text">
            Vedekieli tai vedenkieli on leikkikieli, joka oli yleinen
            erityisesti 1950-luvun Helsingissä. Lue lisää:{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://fi.wikipedia.org/wiki/Vedekieli"
            >
              Wikipedia
            </a>
            .
          </p>
          <p className="info-text">
            Äänivaihtoehtojen määrä vaihtelee selaimen mukaan.
          </p>
          <p className="info-text">
            Puhesyntetisaattori ei välttämättä toimi vanhemmilla
            selainversioilla.{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis#browser_compatibility"
            >
              Lisätietoa
            </a>
            .
          </p>
        </div>

        <h5 className="source-code-text">Lähdekoodi</h5>
        <a
          className="source-code-link"
          target="_blank"
          rel="noreferrer"
          href="https://github.com/a-liljeroos/vedekääntäjä"
        >
          <button className="source-code-btn">GitHub</button>
        </a>
      </div>
    </>
  );
};
