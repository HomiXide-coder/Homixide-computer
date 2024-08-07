import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import Loading from "./Pages/loading";
import Window from "~components/Window/Window";
import { openModal } from "~store/slices/modalSlice";
import { ModalType } from "~types/Modal";

import style from "./hq.module.scss";
import { fetchNui } from "~utils/fetchNui";
import { SendErrorNotification } from "~utils/notifications";
import Icon from "~utils/icon";
import { useTranslation } from "react-i18next";

const HQ = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const home = location.pathname === "/hq";
  const [isLoading, setIsLoading] = useState(true);
  const [strainName, setStrainName] = useState<string>("");
  const { t } = useTranslation();

  useEffect(() => {
    // Check if we're navigating to the index route
    if (location.pathname === "/hq") {
      fetchNui<string | boolean>("fetchStrainName", {}, "Krisi pisi")
        .then((resp) => {
          if (typeof resp == "boolean") {
            // SendErrorNotification("Failed to fetch strain name");
            setStrainName(t("hq.no_strain_name_set"));
            setIsLoading(false);
            return;
          }

          setStrainName(resp);

          setIsLoading(false);
        })
        .catch(() => {
          navigate("/");
        });
    }
  }, [location.pathname, navigate, t]);

  useEffect(() => {}, [navigate]);

  return (
    <Window>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={style.hq}>
          <div className={style.hqContainer}>
            <Routes>
              <Route
                index
                element={
                  <>
                    <div className={style.hqStrainContainer}>
                      <div className={style.hqTurf}>{t("hq.no_turf")}</div>
                      <div className={style.hqStrain}>{strainName}</div>
                      <div
                        className={style.hqStrainButton}
                        onClick={() =>
                          dispatch(
                            openModal({ type: ModalType.StrainNameModal })
                          )
                        }
                      >
                        {t("hq.set_strain_name")}
                      </div>
                    </div>
                    <div className={style.hqActionsContainer}>
                      <div className={style.hqLeftActionsContainer}>
                        <div
                          className={style.hqRobberyContracts}
                          onClick={() => {
                            if (strainName == t("hq.no_strain_name_set")) {
                              SendErrorNotification(t("hq.access_forbidden"));
                              return;
                            }

                            navigate("/hq/robbery/all");
                          }}
                        >
                          <span className={style.hqUpperSpan}>
                            {t("hq.your")}
                          </span>
                          <span className={style.hqMainSpan}>
                            {t("hq.robbery_cons")}
                          </span>
                          <span className={style.hqLowerSpan}>
                            {t("hq.robbery_cons_alt")}
                          </span>

                          {strainName == t("hq.no_strain_name_set") && (
                            <>
                              <div className={style.disabledPage}>
                                <Icon
                                  id="padlock"
                                  className={style.disabledIcon}
                                />
                                <span>{t("hq.locked_strain")}</span>
                              </div>
                            </>
                          )}
                        </div>
                        <div className={style.hqBottomContainer}>
                          <div className={style.hqWeedHireContainer}>
                            <div
                              className={style.hqWeedContacts}
                              // onClick={() => navigate("/hq/weed")}
                            >
                              <span className={style.hqUpperSpan}>
                                {t("hq.list")}
                              </span>
                              <span className={style.hqMainSpan}>
                                {t("hq.weed_cons")}
                              </span>
                              <span className={style.hqLowerSpan}>
                                {t("hq.weed_alt")}
                              </span>

                              <div className={style.disabledPage}>
                                <Icon
                                  id="padlock"
                                  className={style.disabledIcon}
                                />
                              </div>
                            </div>
                            <div
                              className={style.hqHireContacts}
                              // onClick={() => navigate("/hq/hire")}
                            >
                              <span className={style.hqUpperSpan}>
                                {t("hq.list")}
                              </span>
                              <span className={style.hqMainSpan}>
                                {t("hq.hire_cons")}
                              </span>
                              <span className={style.hqLowerSpan}>
                                {t("hq.hire_cons_alt")}
                              </span>

                              <div className={style.disabledPage}>
                                <Icon
                                  id="padlock"
                                  className={style.disabledIcon}
                                />
                              </div>
                            </div>
                          </div>
                          <div className={style.hqStrainsTurfsContainer}>
                            <div
                              className={style.hqStrainsList}
                              // onClick={() => navigate("/hq/strains")}
                            >
                              <span className={style.hqUpperSpan}>
                                {t("hq.list")}
                              </span>
                              <span className={style.hqMainSpan}>
                                {t("hq.strains")}
                              </span>
                              <span className={style.hqLowerSpan}>
                                {t("hq.strains_alt")}
                              </span>

                              <div className={style.disabledPage}>
                                <Icon
                                  id="padlock"
                                  className={style.disabledIcon}
                                />
                              </div>
                            </div>
                            <div
                              className={style.hqTurfsList}
                              // onClick={() => navigate("/hq/turfs")}
                            >
                              <span className={style.hqUpperSpan}>
                                {t("hq.list")}
                              </span>
                              <span className={style.hqMainSpan}>
                                {t("hq.turfs")}
                              </span>
                              <span className={style.hqLowerSpan}>
                                {t("hq.turfs_alt")}
                              </span>

                              <div className={style.disabledPage}>
                                <Icon
                                  id="padlock"
                                  className={style.disabledIcon}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={style.hqRightActionsContainer}>
                        <div
                          className={style.hqMembers}
                          onClick={() => {
                            if (strainName == t("hq.no_strain_name_set")) {
                              SendErrorNotification(t("hq.access_forbidden"));
                              return;
                            }

                            navigate("/hq/members");
                          }}
                        >
                          <span className={style.hqUpperSpan}>
                            {t("hq.management")}
                          </span>
                          <span className={style.hqMainSpan}>
                            {t("hq.group_mems")}
                          </span>
                          <span className={style.hqLowerSpan}>
                            {t("hq.group_mems_alt")}
                          </span>
                          {strainName == t("hq.no_strain_name_set") && (
                            <>
                              <div className={style.disabledPage}>
                                <Icon
                                  id="padlock"
                                  className={style.disabledIcon}
                                />
                                <span>{t("hq.locked_strain")}</span>
                              </div>
                            </>
                          )}
                        </div>
                        <div
                          className={style.hqAnnouncements}
                          onClick={() => {
                            if (strainName == t("hq.no_strain_name_set")) {
                              SendErrorNotification(t("hq.access_forbidden"));
                              return;
                            }

                            navigate("/hq/announcements");
                          }}
                        >
                          <span className={style.hqUpperSpan}>
                            {t("hq.list")}
                          </span>
                          <span className={style.hqMainSpan}>
                            {t("hq.announcements")}
                          </span>
                          <span className={style.hqLowerSpan}>
                            {t("hq.announcements_alt")}
                          </span>

                          {strainName == t("hq.no_strain_name_set") && (
                            <>
                              <div className={style.disabledPage}>
                                <Icon
                                  id="padlock"
                                  className={style.disabledIcon}
                                />
                                <span>{t("hq.locked_strain")}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                }
              ></Route>
            </Routes>
            <Outlet />
          </div>
        </div>
      )}
    </Window>
  );
};

export default HQ;
