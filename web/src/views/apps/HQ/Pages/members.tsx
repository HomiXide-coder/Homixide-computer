import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openModal } from "~store/slices/modalSlice";
import { ModalType } from "~types/Modal";

import Icon from "~utils/icon";
import style from "./styles/members.module.scss";
import { useEffect, useState } from "react";
import { fetchNui } from "~utils/fetchNui";
import { DBResponse } from "~types/Global";
import {
  SendErrorNotification,
  SendSuccessNotification,
} from "~utils/notifications";
import Loading from "./loading";
import { useTranslation } from "react-i18next";

interface Member {
  citizenid: string;
  username: string;
  isOwner?: boolean;
}

interface Members {
  [citizenid: string]: Member;
}

const Members = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [members, setMembers] = useState<Members>({});
  const [initialMembers, setInitialMembers] = useState<Members>({});
  const [maxMembers, setMaxMembers] = useState<number>(0);
  const [isStrainOwner, setIsStrainOwner] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetchNui<Members>(
      "fetchStrainMembers",
      {},
      {
        1: {
          citizenid: "1",
          username: "Kris",
          isOwner: true,
        },
        2: {
          citizenid: "2",
          username: "John",
        },
        3: {
          citizenid: "3",
          username: "Doe",
        },
      }
    )
      .then((resp) => {
        setMembers(resp);
        setInitialMembers(resp);

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

    fetchNui<number>("fetchMaxMembers", {}, 24)
      .then((resp) => {
        setMaxMembers(resp);
      })
      .catch(() => {
        navigate("/");
      });
  }, [navigate]);

  function kickPlayer(citizenid: string) {
    fetchNui<DBResponse>("kickStrainMember", citizenid, {
      0: true,
      1: "Successfully kicked the member",
    })
      .then((resp) => {
        if (resp[0] == true && resp[1]) {
          const newMembers = { ...members };
          delete newMembers[citizenid];
          setMembers(newMembers);
          setInitialMembers(newMembers);
          SendSuccessNotification(resp[1]);
        } else if (resp[0] == false && resp[1]) {
          SendErrorNotification(resp[1]);
        }
      })
      .catch(() => {
        navigate("/");
      });
  }

  return isLoading ? (
    <Loading />
  ) : (
    <div className={style.hq}>
      <div className={style.hqNav}>
        <div className={style.navName}>
          <Icon id="members" className={style.membersIcon} />
          {t("hq_members.members")} ({Object.values(members).length}/
          {maxMembers})
        </div>
        <div className={style.searchMembers}>
          <input
            type="text"
            className={style.searchMembersInput}
            placeholder={t("hq_members.search_placeholder")}
            onChange={(e) => {
              const searchValue = e.target.value;
              if (searchValue === "") {
                setMembers(initialMembers);
                return;
              }

              const filteredMembers = Object.entries(initialMembers).filter(
                ([, { username }]) =>
                  username.toLowerCase().includes(searchValue.toLowerCase())
              );

              setMembers(Object.fromEntries(filteredMembers));
            }}
          />
          <Icon id="search" className={style.iconSearch} />
        </div>
        <div className={style.backButton} onClick={() => navigate("/hq")}>
          {t("back")}
        </div>
      </div>
      <div className={style.hqMembersContainer}>
        <div className={style.hqMembersList}>
          {Object.values(members).length > 0 ? (
            Object.entries(members).map(([citizenid, { username, isOwner }]) =>
              isOwner ? (
                <div className={style.hqMember}>
                  <div className={style.hqMemberName}>{username}</div>
                  <div className={style.hqIconContainerLeader}>
                    <Icon id="leader" className={style.leaderIcon} />
                  </div>
                </div>
              ) : (
                <div className={style.hqMember}>
                  <div className={style.hqMemberName}>{username}</div>
                  {isStrainOwner && (
                    <div
                      className={style.hqIconContainer}
                      onClick={() => kickPlayer(citizenid)}
                    >
                      <Icon id="kick" className={style.kickIcon} />
                    </div>
                  )}
                </div>
              )
            )
          ) : (
            <div
              style={{
                color: "white",
                fontSize: "26px",
              }}
            >
              {t("hq_members.no_members")}
            </div>
          )}
        </div>
        <div className={style.hqInviteMembers}>
          <div className={style.hqImageContainer}>
            <div className={style.hqImageText}>
              {t("hq_members.invite")} <br />
              <span className={style.newMemberText}>
                {t("hq_members.new_member")}
              </span>
            </div>
          </div>
          <div
            className={style.hqInviteDescription}
            dangerouslySetInnerHTML={{ __html: t("hq_members.new_member_alt") }}
          ></div>
          <div
            className={style.hqInviteButton}
            onClick={() =>
              dispatch(openModal({ type: ModalType.InviteMemberModal }))
            }
          >
            {t("hq_members.invite")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;
