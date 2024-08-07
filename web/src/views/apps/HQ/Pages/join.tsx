import { useLocation, useNavigate } from "react-router-dom";
import Icon from "~utils/icon";
import style from "./styles/join.module.scss";
import { useEffect, useState } from "react";
import { fetchNui } from "~utils/fetchNui";
import { DBResponse } from "~types/Global";
import {
  SendErrorNotification,
  SendSuccessNotification,
} from "~utils/notifications";
import Loading from "./loading";
import house_1 from "../../../../../assets/media/contracts/house_1.png";
import house_2 from "../../../../../assets/media/contracts/house_2.png";
import house_3 from "../../../../../assets/media/contracts/house_3.png";
import house_4 from "../../../../../assets/media/contracts/house_4.png";
import house_5 from "../../../../../assets/media/contracts/house_5.png";
import house_6 from "../../../../../assets/media/contracts/house_6.png";
import store_1 from "../../../../../assets/media/contracts/store_1.png";
import store_2 from "../../../../../assets/media/contracts/store_2.png";
import store_3 from "../../../../../assets/media/contracts/store_3.png";
import store_4 from "../../../../../assets/media/contracts/store_4.png";
import store_5 from "../../../../../assets/media/contracts/store_5.png";
import store_6 from "../../../../../assets/media/contracts/store_6.png";
import store_7 from "../../../../../assets/media/contracts/store_7.png";
import store_8 from "../../../../../assets/media/contracts/store_8.png";
import store_9 from "../../../../../assets/media/contracts/store_9.png";
import lmat from "../../../../../assets/media/contracts/lmat.png";
import exch_1 from "../../../../../assets/media/contracts/exch_1.png";
import exch_2 from "../../../../../assets/media/contracts/exch_2.png";
import cokerun from "../../../../../assets/media/contracts/cokerun.png";
import ammunation from "../../../../../assets/media/contracts/ammunation.png";
import { useTranslation } from "react-i18next";

interface Member {
  citizenid: string;
  username: string;
  isLeader?: boolean;
}

interface Members {
  [key: number]: Member;
}

interface ContractInfo {
  [key: string]: string[];
}

interface Contract {
  id: number;
  owner: string;
  name: string;
  category: string;
  info: string;
  image: string;
  price: number;
  minMembers: number;
  maxMembers: number;
  eventInfo: string;
  members: Members | string;
  generateTime: string;
  expirationTime: string;
  resetTime: string;
  status: string;
  displayTime?: string;
  bars?: number;
}

const images = {
  house_1,
  house_2,
  house_3,
  house_4,
  house_5,
  house_6,
  store_1,
  store_2,
  store_3,
  store_4,
  store_5,
  store_6,
  store_7,
  store_8,
  store_9,
  lmat,
  exch_1,
  exch_2,
  cokerun,
  ammunation,
};

const Join = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentLocation = location.pathname.split("/");
  const contractId = currentLocation[currentLocation.length - 1];
  const [contract, setContract] = useState<Contract>({
    id: 1,
    owner: "HQ",
    name: "Strawberry Cash Exchange",
    category: "cashexchange",
    info: JSON.stringify({
      rewards: ["Weapon Parts", "Magazines", "Ammo"],
      requirements: ["Clipper Chimp Hero Ultra (any tier)"],
    }),
    image: "cashexchange",
    price: 160,
    minMembers: 2,
    maxMembers: 4,
    eventInfo: JSON.stringify({
      type: "robbery",
      name: "Strawberry Cash Exchange",
      parameters: {},
    }),
    members: {},
    generateTime: "5/01/2024, 10:23:53 PM",
    expirationTime: "5/01/2024, 10:33:53 PM",
    resetTime: "5/01/2024, 10:53:53 PM",
    status: "available",
  });
  const [maxMembers, setMaxMembers] = useState(0);
  const [isLeader, setIsLeader] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetchNui<Contract>("fetchCrimeContractById", contractId, {
      id: 1,
      owner: "HQ",
      name: "Strawberry Cash Exchange",
      category: "cashexchange",
      info: JSON.stringify({
        rewards: ["Weapon Parts", "Magazines", "Ammo"],
        requirements: ["Clipper Chimp Hero Ultra (any tier)"],
      }),
      image: "cashexchange",
      price: 160,
      minMembers: 2,
      maxMembers: 4,
      eventInfo: JSON.stringify({
        type: "robbery",
        name: "Strawberry Cash Exchange",
        parameters: {},
      }),
      members: {},
      generateTime: "5/01/2024, 10:23:53 PM",
      expirationTime: "5/01/2024, 10:33:53 PM",
      resetTime: "5/01/2024, 10:53:53 PM",
      status: "available",
    })
      .then((contract) => {
        const currDate = new Date();
        const generateDate = new Date(contract.generateTime);
        const expireDate = new Date(contract.expirationTime);
        const resetDate = new Date(contract.resetTime);

        if (currDate > expireDate && currDate < resetDate) {
          const hourDiff =
            Math.abs(resetDate.getTime() - currDate.getTime()) / 36e5;
          const minDiff =
            Math.abs(resetDate.getTime() - currDate.getTime()) / 6e4;

          const percentage = Math.round(
            (Math.abs(currDate - generateDate) /
              Math.abs(resetDate - generateDate)) *
              100
          );

          const barsFilled = Math.floor((percentage / 100) * 18);

          contract.status = "Resetting";
          contract.displayTime = `${Math.floor(hourDiff)}h ${Math.floor(
            minDiff % 60
          )}m`;
          contract.bars = barsFilled;
        } else if (currDate < expireDate) {
          const hourDiff =
            Math.abs(expireDate.getTime() - currDate.getTime()) / 36e5;
          const minDiff =
            Math.abs(expireDate.getTime() - currDate.getTime()) / 6e4;

          const percentage = Math.round(
            (Math.abs(currDate - generateDate) /
              Math.abs(expireDate - generateDate)) *
              100
          );

          const barsFilled = Math.floor((percentage / 100) * 18);

          contract.displayTime = `${Math.floor(hourDiff)}h ${Math.floor(
            minDiff % 60
          )}m`;
          contract.bars = barsFilled;
        } else {
          contract.status = "Resetting";
          contract.displayTime = "Expired";
        }

        if (contract.members) {
          contract.members = JSON.parse(contract.members as string);
        } else {
          contract.members = {};
        }

        setIsLoading(false);
        setContract(contract);
      })
      .catch(() => {
        navigate("/");
      });
  }, [contractId, navigate]);

  useEffect(() => {
    fetchNui<number>("fetchMaxMembers", {}, 9)
      .then((maxMembers) => {
        setMaxMembers(maxMembers);
      })
      .catch(() => {
        navigate("/");
      });
  }, [navigate]);

  useEffect(() => {
    fetchNui<boolean>("fetchIsLeader", contract, false)
      .then((isLeader) => {
        setIsLeader(isLeader);
      })
      .catch(() => {
        navigate("/");
      });
  }, [navigate, contract]);

  const kickPlayer = (id: number) => {
    fetchNui<DBResponse>(
      "kickPlayer",
      { id, contractId: contract.id },
      {
        0: true,
        1: "Member was kicked successfully.",
      }
    )
      .then((resp) => {
        if (resp[0] == true && resp[1]) {
          const newMembers = { ...(contract.members as Members) };
          delete newMembers[id];
          setContract({ ...contract, members: newMembers });
          SendSuccessNotification(resp[1]);

          fetchNui<boolean>("fetchIsLeader", contract, false)
            .then((isLeader) => {
              setIsLeader(isLeader);
            })
            .catch(() => {
              navigate("/");
            });
        } else if (resp[0] == false && resp[1]) {
          SendErrorNotification(resp[1]);
        }
      })
      .catch(() => {
        navigate("/");
      });
  };

  const startContract = () => {
    fetchNui<DBResponse>("startContract", contract.id, {
      0: true,
      1: "Contract started successfully.",
    })
      .then((resp) => {
        if (resp[0] == true && resp[1]) {
          SendSuccessNotification(resp[1]);
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
    <div className={style.join}>
      <div className={style.joinNav}>
        <button
          className={style.backButton}
          onClick={() => navigate("/hq/robbery/all")}
        >
          {t("back")}
        </button>
      </div>
      <div className={style.joinContent}>
        <div className={style.robberyList}>
          <div className={style.robbery} key={contract.id}>
            <div className={style.categoryAndTitle}>
              <div className={style.robberyCategory}>{contract.category}</div>
              <div className={style.robberyTitle}>{contract.name}</div>
            </div>
            <div className={style.robberyImage}>
              <img src={images[contract.image]} alt="cash exchange" />
            </div>
            <div className={style.robberyLabels}>
              {Object.entries(JSON.parse(contract.info) as ContractInfo).map(
                ([label, value]) => (
                  <div className={style.robberyRewards} key={label}>
                    <div className={style.rewardDescription}>
                      <div className={style.rewardIcon}>
                        <Icon id="selection" className={style.selectionIcon} />
                      </div>
                      <div className={style.rewardText}>{label}</div>
                    </div>
                    <div className={style.rewards}>
                      {Object.values(value).join(", ")}
                    </div>
                  </div>
                )
              )}
              <div className={style.contractStatus}>
                <span>{t("hq_join.contract_status")}</span>

                <span
                  className={
                    contract.status == "Available"
                      ? style.green
                      : contract.status == "Unavailable"
                      ? style.red
                      : style.yellow
                  }
                >
                  {contract.status}
                </span>
              </div>
              <div className={style.contractStatus}>
                <span>{t("hq_join.reset_time")}</span>
                <span className={style.yellow}>
                  {new Date(contract.resetTime).toLocaleString()}
                </span>
              </div>
              <div className={style.cooldownProgress}>
                <div className={style.cooldownProgresses}>
                  {[...Array(18)].map((_, i) => (
                    <div key={i} className={style.cooldownProgressBar}>
                      <div
                        className={
                          contract.bars && i < contract.bars
                            ? style.barFill
                            : style.barEmpty
                        }
                      ></div>
                    </div>
                  ))}
                </div>
                <div className={style.cooldownText}>{contract.displayTime}</div>
              </div>
              {isLeader &&
                contract.status != "Resetting" &&
                contract.status != "Expired" &&
                contract.status != "Completed" &&
                contract.status != "In Progress" && (
                  <div className={style.purchaseButton} onClick={startContract}>
                    {t("hq_join.start")}
                  </div>
                )}
            </div>
          </div>
          <div className={style.membersList}>
            {[...Array(maxMembers)].map((_, i) =>
              i < contract.maxMembers ? (
                <div className={style.member}>
                  <div className={style.memberIcon}>
                    <div className={style.plus}>
                      {(contract.members[i] as Member) ? (
                        (contract.members[i] as Member).isLeader ? (
                          <i className="fa-solid fa-crown"></i>
                        ) : (
                          <i className="fa-solid fa-user"></i>
                        )
                      ) : (
                        <i className="fa-solid fa-plus"></i>
                      )}
                    </div>
                  </div>
                  <div className={style.memberName}>
                    {(contract.members[i] as Member)
                      ? (contract.members[i] as Member).username
                      : t("hq_join.free_slot")}
                  </div>
                  <div className={style.memberStatus}>
                    {t("hq_join.join_info")}
                  </div>

                  {isLeader && contract.members[i] && (
                    <div
                      className={style.joinButton}
                      onClick={() => kickPlayer(i)}
                    >
                      {i == 0 ? t("hq_join.leave") : t("hq_join.kick")}
                    </div>
                  )}
                </div>
              ) : (
                <div className={style.member}>
                  <div className={style.memberIcon}>
                    <div className={style.plus}>
                      <i className="fa-solid fa-plus"></i>
                    </div>
                  </div>
                  <div className={style.memberName}>
                    {t("hq_join.free_slot")}
                  </div>
                  <div className={style.memberStatus}>
                    {t("hq_join.join_info")}
                  </div>

                  <div className={style.lockedMember}>
                    <Icon id="padlock" className={style.lockedMemberIcon} />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Join;
