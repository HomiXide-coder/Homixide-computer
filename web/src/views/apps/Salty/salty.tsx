import { useState, useEffect } from "react";
import Window from "../../../components/Window/Window";
import Icon from "../../../utils/icon";
import style from "./salty.module.scss";
import { fetchNui } from "../../../utils/fetchNui";
import { useNavigate } from "react-router-dom";
import { SendErrorNotification } from "../../../utils/notifications";
import { useTranslation } from "react-i18next";

interface DataItem {
  macaddress: string;
  ipaddress: string;
  difficulty: string;
}

interface IplistPageProps {
  progress: number;
  timeRemaining: number;
  ipsList: DataItem[];
}

const shuffleArray = (array: DataItem[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const IplistPage: React.FC<IplistPageProps> = ({
  progress,
  timeRemaining,
  ipsList,
}) => {
  const { t } = useTranslation();

  return (
    <div className={style.iplistPage}>
      <div className={style.iplistHeader}>
        <div className={style.iplistMac}>{t("salty.mac_address")}</div>
        <div className={style.iplistIp}>{t("salty.ip_address")}</div>
        <div className={style.iplistSecurity}>{t("salty.security")}</div>
      </div>
      <div className={style.iplistTable}>
        {ipsList?.map((item: DataItem, index: number) => (
          <div className={style.iplistTableRow} key={index}>
            <div className={style.iplistTableMac}>{item.macaddress}</div>
            <div className={style.iplistTableIp}>{item.ipaddress}</div>
            <div className={style.iplistTableSecurity}>
              <div className={style.securityWrapper}>
                <div
                  className={`${style.securityLevel} ${
                    style["level-" + item.difficulty.toLowerCase()]
                  }`}
                >
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className={style["levelItem"]} />
                  ))}
                </div>
                <div className={style[item.difficulty.toLowerCase()]}>
                  {item.difficulty.toUpperCase()}
                </div>
              </div>
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
  );
};

const Salty = () => {
  const [showIplist, setShowIplist] = useState(false);
  const [isFastAnimation, setIsFastAnimation] = useState(false);
  const [progress, setProgress] = useState(100);
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [datalist, setDatalist] = useState<DataItem[]>([]);
  const { t } = useTranslation();

  const navigate = useNavigate();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (showIplist) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
        setProgress((prevProgress) => prevProgress - 5);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showIplist]); // Only re-run when showIplist changes

  useEffect(() => {
    if (timeRemaining <= 0) {
      setShowIplist(false);
      setIsButtonDisabled(false);
    }
  }, [timeRemaining]); // Re-run when timeRemaining changes

  const handleScanButtonClick = () => {
    if (!isButtonDisabled) {
      setIsFastAnimation(true);
      setIsButtonDisabled(true);

      fetchNui<DataItem[] | boolean>("scanWifis")
        .then((wifis) => {
          if (wifis == false) {
            setIsFastAnimation(false);
            setIsButtonDisabled(false);

            SendErrorNotification(t("salty.not_enough_crypto"));
          } else {
            setDatalist(shuffleArray(wifis as DataItem[]));

            setTimeRemaining(20);
            setProgress(100);

            setTimeout(() => {
              setIsFastAnimation(false);
              setShowIplist(true);
            }, 5000);
          }
        })
        .catch(() => {
          navigate("/");
        });
    }
  };

  return (
    <Window>
      <div className={style.saltyApp}>
        {showIplist && (
          <IplistPage
            progress={progress}
            timeRemaining={timeRemaining}
            ipsList={datalist}
          />
        )}
        <div className={style.scannerContainer}>
          <div className={style.scannerInnerCircle}>
            <div className={style.scannerCircle}>
              <div
                className={`${
                  isFastAnimation ? style.fastLoader : style.loader
                }`}
              />
              <div className={style.textContainer}>
                <div className={style.scanText}>{t("salty.waiting")}</div>
                <div className={style.scanTextSecondary}>
                  {t("salty.waiting_alt")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.scanInfoBox}>
          <Icon id="info" className={style.iconInfo} />
          <div className={style.scanInfo}>{t("salty.scan_info")}</div>
        </div>

        <div className={style.scanButtons}>
          <div
            className={`${style.scanButton} ${
              isButtonDisabled ? style.disabled : ""
            }`}
            onClick={handleScanButtonClick}
          >
            {t("salty.scan")}
          </div>
          <div className={style.cryptoPrice}>1 {t("coin_name")}</div>
        </div>
      </div>
    </Window>
  );
};

export default Salty;
