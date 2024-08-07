import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { hideModal } from "~store/slices/modalSlice";

import style from "./styles/SendCryptoModal.module.scss";
import {
  SendErrorNotification,
  SendSuccessNotification,
} from "~utils/notifications";
import { fetchNui } from "~utils/fetchNui";
import { DBResponse } from "~types/Global";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SendCryptoModal: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sendData, setSendData] = useState({
    address: "",
    amount: 0,
  });
  const { t } = useTranslation();

  const sendCrypto = () => {
    if (!sendData.address || !sendData.amount)
      return SendErrorNotification(t("modals.send_crypto.all_fields"));

    if (sendData.amount < 1)
      return SendErrorNotification(t("modals.send_crypto.amount_limit"));

    fetchNui<DBResponse>("sendCrypto", sendData, {
      0: true,
      1: "You send crypto successfully",
    })
      .then((resp) => {
        if (resp[0] == true && resp[1]) {
          SendSuccessNotification(resp[1]);
          dispatch(hideModal());
          return;
        } else if (resp[0] == false && resp[1]) {
          SendErrorNotification(resp[1]);
          return;
        }
      })
      .catch(() => {
        navigate("/");
      });
  };

  return (
    <>
      <div className={style.modalHeader}>
        {t("modals.send_crypto.send_crypto")}
      </div>
      <div className={style.modalContent}>
        <div className={style.modalInputContainer}>
          <div className={style.modalAddressInput}>
            <input
              className={style.input}
              type="text"
              placeholder={t("modals.send_crypto.crypto_address_placeholder")}
              onChange={(e) => {
                setSendData({ ...sendData, address: e.target.value });
              }}
            />
          </div>
          <div className={style.modalAmountInput}>
            <input
              className={style.input}
              type="number"
              placeholder={t("modals.send_crypto.amount_placeholder")}
              onChange={(e) => {
                setSendData({
                  ...sendData,
                  amount: Number(parseFloat(e.target.value).toFixed(2)),
                });
              }}
            />
          </div>
        </div>
      </div>
      <div className={style.modalButtons}>
        <div className={style.modalConfirmButton} onClick={sendCrypto}>
          {t("modals.send_crypto.send")}
        </div>
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

export default SendCryptoModal;
