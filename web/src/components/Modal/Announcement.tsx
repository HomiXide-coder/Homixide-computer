import React from "react";
import { useDispatch } from "react-redux";
import { hideModal } from "~store/slices/modalSlice";

import style from "./styles/Announcement.module.scss";
import { ModalData } from "~types/Modal";
import { AnnouncementType } from "~types/Global";
import { useTranslation } from "react-i18next";

const Announcement: React.FC<ModalData> = ({ data }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const annData = data as AnnouncementType;

  return (
    <>
      <div className={style.modalHeader}>{annData.title}</div>
      <div className={style.modalContent}>
        {annData.description}
        <br />
        <br />- {annData.author} at {annData.date}
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

export default Announcement;
