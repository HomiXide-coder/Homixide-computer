import { useEffect, useState } from "react";
import Window from "../../../components/Window/Window";
import style from "./miner.module.scss";
import { fetchNui } from "~utils/fetchNui";
import { useNavigate } from "react-router-dom";
import { DBResponse } from "~types/Global";
import {
  SendErrorNotification,
  SendSuccessNotification,
} from "~utils/notifications";
import { useTranslation } from "react-i18next";

const Miner = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0.0);
  const [gains, setGains] = useState(0.0);
  const { t } = useTranslation();

  useEffect(() => {
    fetchNui<number>("fetchMinerGains", {}, 0.69)
      .then((gains) => {
        setGains(gains);
      })
      .catch(() => {
        navigate("/");
      });

    fetchNui<number>("fetchBalance", {}, 0.69)
      .then((balance) => {
        setBalance(balance);
      })
      .catch(() => {
        navigate("/");
      });
  }, [navigate]);

  const withdrawEarnings = () => {
    fetchNui<DBResponse>(
      "withdrawBalance",
      {},
      {
        0: true,
        1: "Successfully withdrew earnings",
      }
    )
      .then((resp) => {
        if (resp[0] == true && resp[1]) {
          fetchNui<number>("fetchBalance", {}, 0.69)
            .then((balance) => {
              setBalance(balance);
            })
            .catch(() => {
              navigate("/");
            });
          setGains(0.0);
          SendSuccessNotification(resp[1]);
        } else if (resp[0] == false && resp[1]) {
          SendErrorNotification(resp[1]);
        }
      })
      .catch(() => {
        navigate("/");
      });
  };

  return (
    <Window>
      <div className={style.miner}>
        <div className={style.minerCryptoBalance}>
          <div className={style.minerCryptoBalanceAmount}>
            {gains} {t("coin_name")}
          </div>
          <div className={style.minerCryptoBalanceInfo}>
            1 {t("coin_name")} / 24 {t("miner.hours")}
          </div>
        </div>
        <div className={style.minerInfoContainer}>
          <div className={style.minerSetup}>
            <div className={style.minerSetupContainer}>
              <div className={style.minerSetupHeader}>
                {t("miner.curr_gpu")}
              </div>
              <div className={style.minerSetupInfo}>
                {t("miner.curr_gpu_info")}
              </div>
            </div>
            <div className={style.minerGpuSpeed}>{t("miner.ghz")}</div>
          </div>
          <div className={style.minerEta}>
            <div className={style.minerEtaContainer}>
              <div className={style.minerEtaHeader}>{t("miner.eta")}</div>
              <div
                className={style.minerEtaInfo}
                dangerouslySetInnerHTML={{ __html: t("miner.eta_info") }}
              ></div>
            </div>
            <div className={style.minerEtaSpeed}>
              1 {t("coin_name")} / 24 {t("miner.hours")}
            </div>
          </div>
          <div className={style.minerBalance}>
            <div className={style.minerBalanceContainer}>
              <div className={style.minerBalanceHeader}>
                {t("miner.curr_balance")}
              </div>
              <div
                className={style.minerBalanceInfo}
                dangerouslySetInnerHTML={{
                  __html: t("miner.curr_balance_info"),
                }}
              ></div>
            </div>
            <div className={style.minerBalanceLabels}>
              <div className={style.minerBalanceAmount}>
                {balance} {t("coin_name")}
              </div>
              <div
                className={style.minerBalanceWithdraw}
                onClick={withdrawEarnings}
              >
                {t("miner.withdraw")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
};

export default Miner;
