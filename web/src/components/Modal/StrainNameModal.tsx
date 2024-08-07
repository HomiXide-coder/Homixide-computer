import { useDispatch } from "react-redux";
import { hideModal } from "~store/slices/modalSlice";
import style from "./styles/StrainNameModal.module.scss";
import { useEffect, useState } from "react";
import { fetchNui } from "~utils/fetchNui";
import { DBResponse } from "~types/Global";
import { useNavigate } from "react-router-dom";
import {
  SendErrorNotification,
  SendSuccessNotification,
} from "~utils/notifications";
import { useTranslation } from "react-i18next";

const StrainNameModal: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cost, setCost] = useState<number>(1);
  const [strainName, setStrainName] = useState<string>("");
  const [renaming, setRenaming] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetchNui<DBResponse>(
      "fetchStrainCost",
      {},
      {
        0: true,
        1: "10",
        2: "KRIS GANG ON TOP",
      }
    )
      .then((resp) => {
        if (resp[0] == true && resp[1] && resp[2]) {
          setStrainName(resp[2]);
          setCost(Number(resp[1]));
          setRenaming(true);
        } else if (resp[0] == false && resp[1]) {
          if (isNaN(Number(resp[1]))) {
            SendErrorNotification(resp[1]);
            dispatch(hideModal());
            return;
          }
          setCost(Number(resp[1]));
          setRenaming(false);
        }
      })
      .catch(() => {
        navigate("/");
      });
  }, [navigate, dispatch]);

  const nameStrain = () => {
    if (strainName.length < 5 || strainName.length > 50) {
      SendErrorNotification(t("modals.setting_strain.strain_name_limit"));
      return;
    }

    fetchNui<DBResponse>(
      "nameStrain",
      { name: strainName, renaming },
      { 0: true, 1: "Successfully named your strain" }
    )
      .then((resp) => {
        if (resp[0] == true && resp[1]) {
          SendSuccessNotification(resp[1]);
        } else if (resp[0] == false && resp[1]) {
          SendErrorNotification(resp[1]);
        }
        dispatch(hideModal());
      })
      .catch(() => {
        navigate("/");
      });
  };

  return (
    <>
      <div className={style.modalHeader}>
        {renaming
          ? `${t("modals.setting_strain.raname_strain")} (${strainName})`
          : t("modals.setting_strain.strain_name")}{" "}
        ({cost} {t("coin_name")})
      </div>
      <div className={style.modalContent}>
        <div className={style.modalInputContainer}>
          <div className={style.modalIdInput}>
            <input
              className={style.input}
              type="text"
              placeholder={t("modals.setting_strain.strain_name")}
              value={strainName}
              onChange={(e) => setStrainName(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className={style.modalButtons}>
        <div className={style.modalConfirmButton} onClick={nameStrain}>
          {t("modals.setting_strain.confirm")} ({cost} {t("coin_name")})
        </div>
        <div
          className={style.modalCloseButton}
          onClick={() => dispatch(hideModal())}
        >
          {t("modals.cancel")}
        </div>
      </div>
    </>
  );
};

export default StrainNameModal;
