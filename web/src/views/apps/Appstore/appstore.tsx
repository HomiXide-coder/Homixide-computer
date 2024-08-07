import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Window from "../../../components/Window/Window";
import Icon from "../../../utils/icon";
import appdataBrowser from "../../../utils/appdata.json";
import { openModal } from "~store/slices/modalSlice";
import { ModalType } from "~types/Modal";

import { fetchNui } from "../../../utils/fetchNui";
import style from "./appstore.module.scss";
import { useTranslation } from "react-i18next";
import { DBResponse } from "~types/Global";
import { SendErrorNotification } from "~utils/notifications";

interface AppData {
  appid: number;
  appname: string;
  appiconid: string;
  description: string;
  price: number;
  disabled?: boolean;
}

interface AppDataObject {
  [key: string]: AppData;
}

interface UserData {
  username: string;
  coins: number;
  coinsDisplayName: string;
}

interface FethcedData {
  user: UserData;
  ownedApps: string[];
  appdata: AppDataObject;
}

const Appstore = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [hasRedirected, setHasRedirected] = useState(false);
  const { t } = useTranslation();

  const [loadedUserData, setLoadedUserData] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    username: "K. Rogers",
    coins: 1000,
    coinsDisplayName: "BUTC",
  });
  const [ownedApps, setOwnedApps] = useState<string[]>([]);
  const [appdata, setAppData] = useState<AppDataObject>({});

  const openApp = (key: string, route: string) => {
    fetchNui<DBResponse>(
      "canOpenApp",
      { key },
      {
        0: true,
      }
    ).then((resp) => {
      if (resp[0] == false && resp[1]) {
        SendErrorNotification(resp[1]);
      } else {
        navigate(route);
      }
    });
  };

  useEffect(() => {
    if (loadedUserData) return;

    fetchNui<FethcedData>(
      "fetchAppStoreData",
      {},
      {
        user: {
          username: "K. Rogers",
          coins: 1000,
          coinsDisplayName: "BUTC",
        },
        ownedApps: [],
        appdata: appdataBrowser,
      }
    )
      .then((data) => {
        setUserData(data.user);
        setOwnedApps(data.ownedApps);
        setAppData(data.appdata);
        setLoadedUserData(true);
      })
      .catch(() => {
        navigate("/");
      });
  }, [navigate, loadedUserData]);

  return (
    <Window>
      <div className={style.appstoreContainer}>
        <div className={style.appsWrapper}>
          {Object.entries(appdata as AppDataObject).map(([key, app]) => (
            <div key={key} className={style.app}>
              <div className={style.appIcon}>
                <Icon
                  id={app.appiconid}
                  className={
                    style[
                      `icon${
                        app.appiconid.charAt(0).toUpperCase() +
                        app.appiconid.slice(1)
                      }`
                    ]
                  }
                />
              </div>
              <div className={style.appInfo}>
                {app.disabled ? (
                  <>
                    <div className={style.appText}>
                      <div className={style.appName}>????</div>
                      <div className={style.appDescription}>Unavailable</div>
                    </div>
                    <div className={style.appSetup}>
                      <div className={style.appPrice}>????</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={style.appText}>
                      <div className={style.appName}>{app.appname}</div>
                      <div className={style.appDescription}>
                        {app.description}
                      </div>
                    </div>
                    <div className={style.appSetup}>
                      <div className={style.appPrice}>{`${
                        app.price == 0 ? t("app_store.free") : app.price
                      } ${
                        app.price == 0 ? "" : userData.coinsDisplayName
                      }`}</div>
                      <div
                        className={
                          ownedApps.includes(key)
                            ? style.appInstalledButton
                            : style.appInstallButton
                        }
                        onClick={() => {
                          if (ownedApps.includes(key)) {
                            openApp(key, `/${key}`);
                          } else {
                            dispatch(
                              openModal({
                                type: ModalType.AppInstallModal,
                                data: { app, balance: userData.coins, key },
                              })
                            );
                          }
                        }}
                      >
                        {ownedApps.includes(key)
                          ? t("app_store.open")
                          : t("app_store.install")}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
};

export default Appstore;
