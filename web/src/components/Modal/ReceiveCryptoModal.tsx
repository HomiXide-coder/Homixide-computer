import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { hideModal } from "~store/slices/modalSlice";
import Icon from "~utils/icon";

import style from "./styles/ReceiveCryptoModal.module.scss";
import { useNavigate } from "react-router-dom";
import { fetchNui } from "~utils/fetchNui";
import { useTranslation } from "react-i18next";

interface UserData {
  username: string;
  cryptoaddress: string;
  macaddress: string;
}

const ReceiveCryptoModal: React.FC = () => {
  const dispatch = useDispatch();
  const addressRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const { t } = useTranslation();

  const handleCopyClick = () => {
    // if (addressRef.current) {
    //   navigator.clipboard.writeText(addressRef.current.textContent || '');
    // }
    if (addressRef.current) {
      const text = addressRef.current.textContent || "";
      const el = document.createElement("input");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
  };

  // const filledDivs = Math.round((value / max) * 20);

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
    <>
      <div className={style.modalHeader}>{t("modals.receive_crypto")}</div>
      <div className={style.modalContent}>
        <div className={style.modalInfoContainer}>
          <div className={style.cryptoAddress} ref={addressRef}>
            {userData?.cryptoaddress}
          </div>
          <div className={style.iconContainer}>
            <Icon
              id="copy"
              className={style.copyIcon}
              onClick={handleCopyClick}
            />
          </div>
        </div>
      </div>
      <div className={style.modalButtons}>
        <div
          className={style.modalCloseButton}
          onClick={() => dispatch(hideModal())}
        >
          {t("modals.close")}
        </div>
      </div>
    </>
  );
};

export default ReceiveCryptoModal;
