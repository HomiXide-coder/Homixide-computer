import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideModal } from "~store/slices/modalSlice";

import style from "./styles/Modal.module.scss";
import { ModalData } from "~types/Modal";
import { fetchNui } from "~utils/fetchNui";
import { DBResponse } from "~types/Global";
import {
  SendErrorNotification,
  SendSuccessNotification,
} from "~utils/notifications";
import { useTranslation } from "react-i18next";

interface AppData {
  appid: number;
  appname: string;
  appiconid: string;
  description: string;
  price: number;
  disabled?: boolean;
}

interface AppDataModal {
  app: AppData;
  balance: number;
  key: string;
}

const AppInstallModal: React.FC<ModalData> = ({ data }) => {
  const dispatch = useDispatch();
  const [insuffientBalance, setInsuffientBalance] = useState(true);

  const app = (data as AppDataModal).app as AppData;
  const balance = (data as AppDataModal).balance as number;
  const key = (data as AppDataModal).key as string;
  const { t } = useTranslation();

  useEffect(() => {
    setInsuffientBalance(balance < app.price);
  }, [setInsuffientBalance, app.price, balance]);

  return (
    <>
      <div className={style.modalHeader}>
        {t("modals.app_installation.app_store")}
      </div>
      <div className={style.modalContent}>
        {t("modals.app_installation.about_to_install")} {app.appname} <br />
        {t("modals.app_installation.curr_balance")} {balance} {t("coin_name")}{" "}
        <br />
        {t("modals.app_installation.cost")} {app.price} {t("coin_name")}
        {insuffientBalance && (
          <span className={style.modalError}>
            {t("modals.app_installation.insuff_balance")}
          </span>
        )}
      </div>
      <div className={style.modalButtons}>
        <div
          className={style.modalConfirmButton}
          onClick={() => {
            fetchNui<DBResponse>("installApp", key)
              .then((response) => {
                if (response[0] == false && response[1]) {
                  SendErrorNotification(response[1]);
                } else {
                  SendSuccessNotification(
                    t("modals.app_installation.installed_succ")
                  );
                }

                dispatch(hideModal());
              })
              .catch((error) => {
                console.error(error);
              });
          }}
        >
          {t("modals.app_installation.install")}
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

export default AppInstallModal;
