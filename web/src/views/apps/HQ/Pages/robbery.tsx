import { useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";

import style from "./styles/robbery.module.scss";
import Icon from "~utils/icon";
import { useEffect, useState } from "react";
import { fetchNui } from "~utils/fetchNui";
import { DBResponse } from "~types/Global";
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

import {
  SendErrorNotification,
  SendSuccessNotification,
} from "~utils/notifications";
import Loading from "./loading";
import { useTranslation } from "react-i18next";

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
  eventInfo: string;
  members: string[];
  generateTime: string;
  expirationTime: string;
  resetTime: string;
  status: string;
  displayTime?: string;
  bars?: number;
}

interface Category {
  [key: string]: string;
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

const Robbery = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentLocation = location.pathname.split("/");
  const category = currentLocation[currentLocation.length - 1];
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [categories, setCategories] = useState<Category>({});
  const [deskId, setDeskId] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const handleCategoryClick = (cat: string) => {
    if (category === cat) return;

    setIsLoading(true);
    navigate(`/hq/robbery/${cat}`);
  };

  useEffect(() => {
    fetchNui<Contract[]>("fetchCrimeContracts", category, [
      {
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
        eventInfo: JSON.stringify({
          type: "robbery",
          name: "Strawberry Cash Exchange",
          parameters: {},
        }),
        members: [],
        generateTime: "5/01/2024, 10:23:53 PM",
        expirationTime: "5/01/2024, 10:33:53 PM",
        resetTime: "5/01/2024, 10:53:53 PM",
        status: "available",
      },
      {
        id: 2,
        owner: "HQ",
        name: "Rancho Cash Exchange",
        category: "robbery",
        info: JSON.stringify({
          rewards: ["Weapon Parts", "Magazines", "Ammo"],
          requirements: ["Clipper Chimp Hero Ultra (any tier)"],
        }),
        image: "cashexchange",
        price: 160,
        eventInfo: JSON.stringify({
          type: "robbery",
          name: "Rancho Cash Exchange",
          parameters: {},
        }),
        members: [],
        generateTime: "5/01/2024, 10:23:53 PM",
        expirationTime: "5/01/2024, 10:33:53 PM",
        resetTime: "5/01/2024, 10:53:53 PM",
        status: "unavailable",
      },
    ])
      .then((contracts) => {
        contracts.forEach((contract) => {
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
        });

        setIsLoading(false);

        setContracts(contracts);
      })
      .catch(() => {
        navigate("/");
      });
  }, [category, navigate]);

  useEffect(() => {
    fetchNui<string>("fetchDeskId", {}, "1")
      .then((deskId) => {
        setDeskId(deskId);
      })
      .catch(() => {
        navigate("/");
      });
  }, [navigate]);

  const purchaseContract = (id: number) => {
    fetchNui<DBResponse>("purchaseCrimeContract", id, {
      0: true,
      1: "Contract was purchased successfully.",
    })
      .then((resp) => {
        if (resp[0] == true && resp[1]) {
          SendSuccessNotification(resp[1]);
          navigate(`/hq/join/${id}`);
        } else if (resp[0] == false && resp[1]) {
          SendErrorNotification(resp[1]);
        }
      })
      .catch(() => {
        navigate("/");
      });
  };

  const refreshContracts = () => {
    setIsLoading(true);
    fetchNui<Contract[]>("fetchCrimeContracts", category, [
      {
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
        eventInfo: JSON.stringify({
          type: "robbery",
          name: "Strawberry Cash Exchange",
          parameters: {},
        }),
        members: [],
        generateTime: "5/01/2024, 10:23:53 PM",
        expirationTime: "5/01/2024, 10:33:53 PM",
        resetTime: "5/01/2024, 10:53:53 PM",
        status: "available",
      },
      {
        id: 2,
        owner: "HQ",
        name: "Rancho Cash Exchange",
        category: "robbery",
        info: JSON.stringify({
          rewards: ["Weapon Parts", "Magazines", "Ammo"],
          requirements: ["Clipper Chimp Hero Ultra (any tier)"],
        }),
        image: "cashexchange",
        price: 160,
        eventInfo: JSON.stringify({
          type: "robbery",
          name: "Rancho Cash Exchange",
          parameters: {},
        }),
        members: [],
        generateTime: "5/01/2024, 10:23:53 PM",
        expirationTime: "5/01/2024, 10:33:53 PM",
        resetTime: "5/01/2024, 10:53:53 PM",
        status: "unavailable",
      },
    ])
      .then((contracts) => {
        contracts.forEach((contract) => {
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
        });

        setIsLoading(false);

        setContracts(contracts);
      })
      .catch(() => {
        navigate("/");
      });
  };

  useEffect(() => {
    fetchNui<Category>(
      "fetchContractsCategories",
      {},
      {
        all: "All",
        robbery: "Robbery",
        laundromat: "Laundromat",
        cashexchange: "Cash Exchange",
        global: "Global",
        hq: "HQ",
      }
    )
      .then((categories) => {
        setCategories(categories);
      })
      .catch(() => {
        navigate("/");
      });
  }, [category, navigate]);

  return isLoading ? (
    <Loading />
  ) : (
    <div className={style.robberyWrapper}>
      <div className={style.robberyNav}>
        <div className={style.categories}>
          {Object.entries(categories).map(([cat, name]) => (
            <div
              key={cat}
              className={classNames(style.category, {
                [style.active]: ["/", `/hq/robbery/${cat}`].includes(
                  location.pathname
                ),
              })}
              onClick={() => handleCategoryClick(cat)}
            >
              {name}
            </div>
          ))}
        </div>
        <div className={style.navButtons}>
          <button className={style.refreshButton} onClick={refreshContracts}>
            {t("hq_robbery.refresh")}
          </button>
          <button className={style.backButton} onClick={() => navigate("/hq")}>
            {t("back")}
          </button>
        </div>
      </div>
      <div className={style.robberyContainer}>
        <div className={style.robberyList}>
          {contracts.length > 0 ? (
            contracts.map((contract) => (
              <div className={style.robbery} key={contract.id}>
                <div className={style.categoryAndTitle}>
                  <div className={style.robberyCategory}>
                    {categories[contract.category]}
                  </div>
                  <div className={style.robberyTitle}>{contract.name}</div>
                </div>
                <div className={style.robberyImage}>
                  <img src={images[contract.image]} alt="cash exchange" />
                </div>
                <div className={style.robberyLabels}>
                  {Object.entries(
                    JSON.parse(contract.info) as ContractInfo
                  ).map(([label, value]) => (
                    <div className={style.robberyRewards} key={label}>
                      <div className={style.rewardDescription}>
                        <div className={style.rewardIcon}>
                          <Icon
                            id="selection"
                            className={style.selectionIcon}
                          />
                        </div>
                        <div className={style.rewardText}>{label}</div>
                      </div>
                      <div className={style.rewards}>
                        {Object.values(value).join(", ")}
                      </div>
                    </div>
                  ))}
                  <div className={style.contractStatus}>
                    <span>{t("hq_robbery.contract_status")}</span>

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
                    <span>{t("hq_robbery.reset_time")}</span>
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
                    <div className={style.cooldownText}>
                      {contract.displayTime}
                    </div>
                  </div>
                  {contract.owner == null && contract.status == "Available" && (
                    <div
                      className={style.purchaseButton}
                      onClick={() => purchaseContract(contract.id)}
                    >
                      {t("hq_robbery.purchase")} {contract.price}{" "}
                      {t("coin_name")}
                    </div>
                  )}
                  {contract.owner == deskId &&
                    contract.status != "Resetting" &&
                    contract.status != "Expired" &&
                    contract.status != "Completed" &&
                    contract.status != "In Progress" && (
                      <div
                        className={style.purchaseButton}
                        onClick={() => navigate(`/hq/join/${contract.id}`)}
                      >
                        {t("hq_robbery.members")}
                      </div>
                    )}
                </div>
              </div>
            ))
          ) : (
            <div className={style.noContracts}>
              <Icon id="sademoji" className={style.emoji} />
              <span>{t("hq_robbery.no_contracts")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Robbery;
