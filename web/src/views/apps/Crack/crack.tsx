import { useState, useEffect, useRef } from "react";
import generateRandomAlphanumericArray from "../../../utils/alphaNumericGenerator";
import Window from "../../../components/Window/Window";
import style from "./crack.module.scss";
import { fetchNui } from "~utils/fetchNui";
import { useNavigate } from "react-router-dom";
import {
  SendErrorNotification,
  SendSuccessNotification,
} from "~utils/notifications";
import { DBResponse } from "~types/Global";
import { useTranslation } from "react-i18next";

interface IplistPageProps {
  progress: number;
  timeRemaining: number;
  callback: (result: boolean) => void;
}

interface crackProps {
  macAddress: string;
  ipAddress: string;
}

const CrackHack: React.FC<IplistPageProps> = ({
  progress,
  timeRemaining,
  callback,
}) => {
  const [randomCharacters, setRandomCharacters] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [correctIndices, setCorrectIndices] = useState<number[]>([]);
  const [wrongKeyPressed, setWrongKeyPressed] = useState<boolean>(false);
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRandomCharacters(generateRandomAlphanumericArray(15));
    if (gameRef.current) {
      gameRef.current.focus();
    }
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const pressedKey = event.key.toLowerCase();
    const currentCharacter = randomCharacters[currentIndex];

    if (pressedKey === currentCharacter) {
      setCorrectIndices((prevIndices) => [...prevIndices, currentIndex]);
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setWrongKeyPressed(false);

      if (currentIndex === randomCharacters.length - 1) {
        // alert("Congratulations! You matched all characters!");
        setCurrentIndex(0);
        setRandomCharacters(generateRandomAlphanumericArray(15));
        callback(true);
      }
    } else {
      setWrongKeyPressed(true);
      setCorrectIndices([]);
      setCurrentIndex(0);
      // alert("Incorrect key pressed! Try again.");
      callback(false);
    }
  };

  return (
    <div className={style.crackContainer}>
      <div className={style.hackContainer}>
        <div
          ref={gameRef}
          className={style.keyboard}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {randomCharacters.map((char, index) => (
            <div
              key={index}
              className={`${
                style[
                  "key-" +
                    (wrongKeyPressed
                      ? "wrong"
                      : correctIndices.includes(index)
                      ? "correct"
                      : "default")
                ]
              }`}
            >
              <div
                className={`${
                  style[
                    "character-" +
                      (wrongKeyPressed
                        ? "wrong"
                        : correctIndices.includes(index)
                        ? "correct"
                        : "default")
                  ]
                }`}
              >
                {char}
              </div>
            </div>
          ))}
        </div>
        <div className={style.progressWrapper}>
          <div
            className={style.progressBar}
            style={{ width: `${progress}%` }}
          ></div>
          <div className={style.progressTime}>{timeRemaining}s</div>
        </div>
      </div>
    </div>
  );
};

const Crack = () => {
  const navigate = useNavigate();
  const [toggleHack, setToggleHack] = useState<boolean>(false);
  const [formState, setFormState] = useState<crackProps>({
    macAddress: "",
    ipAddress: "",
  });
  const [hacktime, setHackTime] = useState(0);
  const [initialHacktime, setInitialHacktime] = useState(0);
  const [hackProgress, setHackProgress] = useState<number>(100);
  const [hackDifficulty, setHackDifficulty] = useState<string>("");
  const [hackResult, setHackResult] = useState<boolean | null>(null);
  const { t } = useTranslation();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleHackButton = () => {
    fetchNui<DBResponse>(
      "startCrackHack",
      { mac: formState.macAddress, ip: formState.ipAddress },
      { 0: true }
    )
      .then((data) => {
        if (data[0] == true && data[1] && data[2]) {
          setHackTime(Number(data[1]));
          setInitialHacktime(Number(data[1]));
          setHackDifficulty(data[2]);
          setToggleHack(true);
        } else if (data[0] == false && data[1]) {
          SendErrorNotification(data[1]);
        }
      })
      .catch(() => {
        navigate("/");
      });
  };

  useEffect(() => {
    if (hackResult !== null) {
      fetchNui<DBResponse>(
        "finishCrackHack",
        { result: hackResult, difficulty: hackDifficulty },
        { 0: true }
      )
        .then((response) => {
          if (response[0] == true && response[1]) {
            SendSuccessNotification(response[1]);
          } else if (response[0] == false && response[1]) {
            SendErrorNotification(response[1]);

            if (response[2] == "disabled") {
              fetchNui("hideFrame");
            }
          }

          setFormState({ macAddress: "", ipAddress: "" });
        })
        .catch(() => {
          navigate("/");
        });
    }
  }, [hackResult, navigate, hackDifficulty]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (toggleHack) {
      interval = setInterval(() => {
        setHackTime((prevTime) => prevTime - 1);
        setHackProgress((prevProgress) => prevProgress - 100 / initialHacktime);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [toggleHack, initialHacktime]); // Only re-run when showIplist changes

  useEffect(() => {
    if (toggleHack) {
      if (hacktime <= 0) {
        setHackResult(false);
        setToggleHack(false);
      }
    }
  }, [hacktime, toggleHack]); // Re-run when timeRemaining changes

  return (
    <Window>
      {toggleHack ? (
        <CrackHack
          progress={hackProgress}
          timeRemaining={hacktime}
          callback={(result) => {
            setHackResult(result);
            setToggleHack(false);
          }}
        />
      ) : (
        <div className={style.crackApp}>
          <div className={style.macContainer}>
            <div className={style.macInfo}>
              <div className={style.macHeader}>{t("crack.mac_header")}</div>
              <div className={style.macAlt}>{t("crack.mac_alt")}</div>
            </div>
            <div className={style.macInputBox}>
              <input
                type="text"
                placeholder={t("crack.mac_header")}
                className={style.macInput}
                name="macAddress"
                value={formState.macAddress}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={style.ipContainer}>
            <div className={style.ipInfo}>
              <div className={style.ipHeader}>{t("crack.ip_header")}</div>
              <div className={style.ipAlt}>{t("crack.ip_alt")}</div>
            </div>
            <div className={style.ipInputBox}>
              <input
                type="text"
                placeholder={t("crack.ip_header")}
                className={style.ipInput}
                name="ipAddress"
                value={formState.ipAddress}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={style.crackButton} onClick={handleHackButton}>
            <div className={style.crackHeader}>{t("crack.crack_header")}</div>
            <div className={style.crackText}>{t("crack.crack_alt")}</div>
          </div>
        </div>
      )}
    </Window>
  );
};

export default Crack;
