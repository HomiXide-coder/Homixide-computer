import Window from "../../../components/Window/Window";
import gpu from "../../../../assets/media/gpu.png";
import style from "./minerext.module.scss";
import { useEffect, useState } from "react";
import { fetchNui } from "~utils/fetchNui";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Rack {
  gains: number;
  gpus: number;
}

interface Racks {
  [name: string]: Rack;
}

const MinerExt = () => {
  const navigate = useNavigate();
  const [racks, setRacks] = useState<Racks>({});
  const [totalGain, setTotalGain] = useState(0);
  const [balance, setBalance] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    fetchNui<Racks>(
      "fetchRacks",
      {},
      {
        "GPU RACK #1": {
          gains: 0.0694,
          gpus: 4,
        },
        "GPU RACK #2": {
          gains: 0.0694,
          gpus: 4,
        },
        "GPU RACK #3": {
          gains: 0.0694,
          gpus: 4,
        },
        "GPU RACK #4": {
          gains: 0.0694,
          gpus: 4,
        },
      }
    )
      .then((racks) => {
        setRacks(racks);

        Object.entries(racks).map(([name, rack]) => {
          setTotalGain((prev) => prev + rack.gains);
        });
      })
      .catch(() => {
        navigate("/");
      });

    fetchNui<number>("fetchMinerEXTGains", {}, 1)
      .then((balance) => {
        setBalance(balance);
      })
      .catch(() => {
        navigate("/");
      });
  }, [navigate]);

  return (
    <Window>
      <div className={style.minerExt}>
        <div className={style.minerExtRigContainer}>
          {Object.values(racks).length > 0 ? (
            Object.entries(racks).map(([name, rack]) => (
              <div key={name} className={style.minerExtRigRack}>
                <div className={style.minerExtRigRackContainer}>
                  <div className={style.minerExtRigRackImgContainer}>
                    <img src={gpu} alt="GPU" className={style.minerExtRigGpu} />
                  </div>
                  <div className={style.minerExtRigRackTextContainer}>
                    <p className={style.minerExtRigText}>{name}</p>
                    <p className={style.minerExtRigLinkText}>
                      {t("minerext.rack_linked")}
                    </p>
                  </div>
                </div>
                <div className={style.minerExtRigInfo}>
                  <div
                    className={style.minerExtRigInfoField}
                    style={{
                      backgroundColor: "rgba(247, 47, 73, 0.2)",
                      color: "rgba(247, 47, 73, 1)",
                    }}
                  >
                    {typeof rack.gpus == "number"
                      ? rack.gpus
                      : Object.values(rack.gpus).length}{" "}
                    {t("minerext.gpus")}
                  </div>
                  <div
                    className={style.minerExtRigInfoField}
                    style={{
                      backgroundColor: "rgba(227, 174, 50, 0.2)",
                      color: "rgba(227, 174, 50, 1)",
                    }}
                  >
                    {rack.gains.toFixed(1)} {t("coin_name")}/{t("minerext.day")}
                  </div>
                  <div
                    className={style.minerExtRigInfoField}
                    style={{
                      backgroundColor: "rgba(43, 173, 63, 0.2)",
                      color: "rgba(43, 173, 63, 1)",
                    }}
                  >
                    {t("miner.ghz")}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={style.minerExtRigNoracks}>
              {t("minerext.no_racks")}
            </div>
          )}
        </div>
        <div className={style.minerExtCryptoBalance}>
          <div className={style.minerExtCryptoBalanceAmount}>
            {balance} {t("coin_name")}
          </div>
          <div className={style.minerExtCryptoBalanceInfo}>
            {totalGain} {t("coin_name")} / 24 {t("miner.hours")}
          </div>
        </div>
      </div>
    </Window>
  );
};

export default MinerExt;
