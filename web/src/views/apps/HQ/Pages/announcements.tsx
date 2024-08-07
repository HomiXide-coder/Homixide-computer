import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openModal } from "~store/slices/modalSlice";
import { ModalType } from "~types/Modal";
import Icon from "~utils/icon";
import style from "./styles/announcements.module.scss";
import { useEffect, useState } from "react";
import { fetchNui } from "~utils/fetchNui";
import { AnnouncementType, DBResponse } from "~types/Global";
import {
  SendErrorNotification,
  SendSuccessNotification,
} from "~utils/notifications";
import Loading from "./loading";
import { useTranslation } from "react-i18next";

interface Announcements {
  [key: string]: AnnouncementType;
}

const Announcements = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [announcements, setAnnouncements] = useState<Announcements>({});
  const [isStrainOwner, setIsStrainOwner] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetchNui<Announcements>(
      "fetchStrainAnnouncements",
      {},
      {
        "0": {
          id: 0,
          author: "Kris",
          title: "Cql den pravq tupoto hq",
          description: "Cql den pravq tupoto hq",
          date: "Mon Apr 20 2024",
        },
        "1": {
          id: 1,
          author: "Kris2",
          title: "Cql den pravq tupoto hq2",
          description: "Cql den pravq tupoto hq2",
          date: "Mon Apr 21 2024",
        },
      }
    )
      .then((data) => {
        setAnnouncements(data);

        setIsLoading(false);
      })
      .catch(() => {
        navigate("/");
      });

    fetchNui<boolean>("fetchIsOwnerOfStrain", {}, true)
      .then((resp) => {
        setIsStrainOwner(resp);
      })
      .catch(() => {
        navigate("/");
      });
  }, [navigate]);

  const deleteAnnouncement = (id: number) => {
    fetchNui<DBResponse>("deleteStrainAnnouncement", id, {
      0: true,
      1: "Announcement deleted successfully.",
    })
      .then((resp) => {
        if (resp[0] == true && resp[1]) {
          SendSuccessNotification(resp[1]);
          const newAnnouncements = { ...announcements };
          delete newAnnouncements[id];
          setAnnouncements(newAnnouncements);
        } else if (resp[0] == false && resp[1]) {
          SendErrorNotification(resp[1]);
        }
      })
      .catch(() => {
        navigate("/");
      });
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div className={style.announcements}>
      <div className={style.announcementsNav}>
        <div className={style.navName}>
          <Icon id="announcement" className={style.announcementIcon} />
          {t("hq_announcements.recent")}
        </div>
        <div className={style.buttons}>
          {isStrainOwner && (
            <div
              className={style.createButton}
              onClick={() =>
                dispatch(
                  openModal({
                    type: ModalType.CreateAnnouncement,
                  })
                )
              }
            >
              {t("hq_announcements.new_announcement")}
            </div>
          )}
          <div className={style.backButton} onClick={() => navigate("/hq")}>
            {t("back")}
          </div>
        </div>
      </div>
      <div className={style.announcementsContainer}>
        <div className={style.announcementsList}>
          {Object.values(announcements).length > 0 ? (
            Object.entries(announcements).map(([key, announcement]) => (
              <div className={style.announcement} key={key}>
                <div className={style.announcementInfo}>
                  <div className={style.announcerAndStatus}>
                    <div className={style.announcer}>{announcement.author}</div>
                  </div>
                  <div className={style.announcementDate}>
                    {announcement.date}
                  </div>
                </div>
                <div className={style.announcementContent}>
                  <div className={style.announcementText}>
                    {announcement.title}
                  </div>
                  <div className={style.actionButtons}>
                    <div
                      className={style.readButton}
                      onClick={() =>
                        dispatch(
                          openModal({
                            type: ModalType.Announcement,
                            data: announcement,
                          })
                        )
                      }
                    >
                      {t("hq_announcements.open")}
                    </div>
                    {isStrainOwner && (
                      <div
                        className={style.deleteButton}
                        onClick={() => deleteAnnouncement(announcement.id)}
                      >
                        {t("hq_announcements.delete")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                color: "white",
                fontSize: "26px",
              }}
            >
              {t("hq_announcements.no_announcements")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
