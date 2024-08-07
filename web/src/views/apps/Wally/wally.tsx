import { useDispatch } from "react-redux";
import Window from "../../../components/Window/Window";
import { openModal } from "~store/slices/modalSlice";
import { ModalType } from "~types/Modal";
import Icon from "~utils/icon";
import style from "./wally.module.scss";
import { useEffect, useState } from "react";
import { fetchNui } from "~utils/fetchNui";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// type ProgressBarProps = {
//   value: number; // Current value (0-100)
//   max: number; // Maximum value (100 in your case)
// };

interface UserData {
  username: string;
  cryptoaddress: string;
  macaddress: string;
}

// const Wally: React.FC<ProgressBarProps> = ({ value, max }) => {
const Wally: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  // const filledDivs = Math.round((value / max) * 20);
  const { t } = useTranslation();

  useEffect(() => {
    fetchNui<UserData | boolean>(
      "fetchWallyData",
      {},
      {
        username: "KRISI PISI",
        cryptoaddress: "0x12121212",
        macaddress: "12:12:12:12",
      }
    )
      .then((data) => {
        if (typeof data === "boolean") {
          navigate("/");
          return;
        }
        setUserData(data);
      })
      .catch(() => {
        navigate("/");
      });
  }, [navigate]);

  return (
    <Window>
      <div className={style.wally}>
        <div className={style.wallyContainer}>
          <div className={style.wallyUserdata}>
            <div className={style.wallyUsername}>
              <div className={style.wallyUserdataHeader}>
                {t("wally.username")}
              </div>
              <p className={style.wallyUserdataText}>
                {t("wally.username_alt")}
              </p>
              <div className={style.wallyUserdataButton}>
                {userData?.username}
              </div>
            </div>
            <div className={style.wallyUserCryptoAddress}>
              <div className={style.wallyUserdataHeader}>
                {t("wally.crypto_address")}
              </div>
              <p className={style.wallyUserdataText}>
                {t("wally.crypto_address_alt")}
              </p>
              <div className={style.wallyUserdataButton}>
                {userData?.cryptoaddress}
              </div>
            </div>
            <div className={style.wallyUserMacAddress}>
              <div className={style.wallyUserdataHeader}>
                {t("wally.mac_address")}
              </div>
              <p className={style.wallyUserdataText}>
                {t("wally.mac_address_alt")}
              </p>
              <div className={style.wallyUserdataButton}>
                {userData?.macaddress}
              </div>
            </div>
          </div>
          <div className={style.wallyReputation}>
            <div className={style.wallyReputationTextContainer}>
              <div className={style.wallyReputationHeader}>
                {t("wally.reputation")}
              </div>
              <div className={style.wallyReputationText}>
                {t("wally.reputation_alt")}
              </div>
            </div>
            <div className={style.wallyReputationProgress}>
              <div className={style.wallyReputationExp}>0 / 100</div>
              <div className={style.wallyReputationProgressbar}>
                I I I I I I I I I I I I I I I I I I I I
              </div>
            </div>
          </div>
          <div className={style.wallyActions}>
            <div className={style.wallySendCrypto}>
              <div className={style.wallyActionContainer}>
                <div className={style.wallyHeaderContainer}>
                  <div className={style.wallyActionHeader}>
                    {t("wally.send_crypto")}
                  </div>
                  <div className={style.wallyActionDescription}>
                    {t("wally.send_crypto_alt")}
                  </div>
                </div>
                <Icon id="send" className={style.wallyActionIcon} />
              </div>
              <div
                className={style.wallyActionButton}
                onClick={() =>
                  dispatch(openModal({ type: ModalType.SendCryptoModal }))
                }
              >
                {t("wally.send_crypto")}
              </div>
            </div>
            <div className={style.wallyReceiveCrypto}>
              <div className={style.wallyActionContainer}>
                <div className={style.wallyHeaderContainer}>
                  <div className={style.wallyActionHeader}>
                    {t("wally.receive_crypto")}
                  </div>
                  <div className={style.wallyActionDescription}>
                    {t("wally.receive_crypto_alt")}
                  </div>
                </div>
                <Icon id="receive" className={style.wallyActionIcon} />
              </div>
              <div
                className={style.wallyActionButton}
                onClick={() =>
                  dispatch(openModal({ type: ModalType.ReceiveCryptoModal }))
                }
              >
                {t("wally.receive_crypto")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
};

export default Wally;
