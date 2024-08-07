import { useDispatch } from "react-redux";
import { hideModal } from "~store/slices/modalSlice";
import style from "./styles/CreateAnnouncement.module.scss";
import { useState } from "react";
import {
  SendErrorNotification,
  SendSuccessNotification,
} from "~utils/notifications";
import { fetchNui } from "~utils/fetchNui";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface AnnouncementData {
  title: string;
  description: string;
}

const CreateAnnouncement: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [announcementData, setAnnouncementData] = useState<AnnouncementData>({
    title: "",
    description: "",
  });
  const { t } = useTranslation();

  const createAnnouncement = () => {
    if (
      announcementData.title.length < 5 ||
      announcementData.title.length > 20
    ) {
      SendErrorNotification(t("modals.announcement_creation.title_limit"));
      return;
    }
    if (
      announcementData.description.length < 20 ||
      announcementData.description.length > 200
    ) {
      SendErrorNotification(t("modals.announcement_creation.desc_limit"));
      return;
    }

    fetchNui("createStrainAnnouncement", announcementData, {
      0: true,
      1: "Announcement created successfully.",
    })
      .then((resp) => {
        if (resp[0] == true && resp[1]) {
          SendSuccessNotification(resp[1]);
        } else if (resp[0] == false && resp[1]) {
          SendErrorNotification(resp[1]);
        }
        dispatch(hideModal());
      })
      .catch(() => {
        dispatch(hideModal());
        navigate("/");
      });
  };

  return (
    <>
      <div className={style.modalHeader}>
        {t("modals.announcement_creation.create_announcement")}
      </div>
      <div className={style.modalContent}>
        <div className={style.modalInputContainer}>
          <div className={style.modalIdInput}>
            <input
              className={style.input}
              type="text"
              placeholder={t("modals.announcement_creation.title_placeholder")}
              value={announcementData.title}
              onChange={(e) => {
                setAnnouncementData({
                  ...announcementData,
                  title: e.target.value,
                });
              }}
            />
          </div>
          <div className={style.modalIdInput}>
            <input
              className={style.input}
              type="text"
              placeholder={t("modals.announcement_creation.desc_placeholder")}
              value={announcementData.description}
              onChange={(e) => {
                setAnnouncementData({
                  ...announcementData,
                  description: e.target.value,
                });
              }}
            />
          </div>
        </div>
      </div>
      <div className={style.modalButtons}>
        <div className={style.modalConfirmButton} onClick={createAnnouncement}>
          {t("modals.announcement_creation.create")}
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

export default CreateAnnouncement;
