import { useDispatch } from "react-redux";
import { hideModal } from "~store/slices/modalSlice";
import style from "./styles/InviteMemberModal.module.scss";
import { useEffect, useState } from "react";
import { fetchNui } from "~utils/fetchNui";
import { useNavigate } from "react-router-dom";
import {
  SendErrorNotification,
  SendSuccessNotification,
} from "~utils/notifications";
import { DBResponse } from "~types/Global";
import { useTranslation } from "react-i18next";

const InviteMemberModal: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cost, setCost] = useState<number>(1);
  const [memberId, setMemberId] = useState<number>(1);
  const [disabledControls, setDisabledControls] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetchNui<number>("fetchMemberInviteCost", {}, 1)
      .then((resp) => {
        setCost(resp);
      })
      .catch(() => {
        navigate("/");
      });
  });

  const inviteMember = () => {
    if (memberId < 1)
      return SendErrorNotification(
        t("modals.member_invitation.state_id_limit")
      );

    setDisabledControls(true);

    fetchNui<DBResponse>("inviteMember", memberId, {
      0: true,
      1: "Waiting for acceptance",
    })
      .then((resp) => {
        if (resp[0] == true && resp[1]) {
          SendSuccessNotification(resp[1]);
        } else if (resp[0] == false && resp[1]) {
          SendErrorNotification(resp[1]);
        }
        dispatch(hideModal());
        setDisabledControls(true);
      })
      .catch(() => {
        navigate("/");
        setDisabledControls(true);
      });
  };

  return (
    <>
      <div className={style.modalHeader}>
        {t("modals.member_invitation.invite")} ({cost} {t("coin_name")})
      </div>
      <div className={style.modalContent}>
        <div className={style.modalInputContainer}>
          <div className={style.modalIdInput}>
            <input
              className={style.input}
              type="number"
              placeholder={t("modals.member_invitation.state_id_placeholder")}
              value={memberId}
              onChange={(e) => setMemberId(parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>
      <div className={style.modalButtons}>
        <button
          className={style.modalConfirmButton}
          onClick={inviteMember}
          disabled={disabledControls}
        >
          {t("modals.member_invitation.invite")} ({cost} {t("coin_name")})
        </button>
        <button
          className={style.modalCloseButton}
          onClick={() => dispatch(hideModal())}
          disabled={disabledControls}
        >
          {t("modals.cancel")}
        </button>
      </div>
    </>
  );
};

export default InviteMemberModal;
