import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "/assets/media/logo.png";
import Icon from "../../utils/icon";

import style from "./NavBar.module.scss";
import { useNuiEvent } from "../../hooks/useNuiEvent";
import { fetchNui } from "~utils/fetchNui";
import { DBResponse } from "~types/Global";
import { SendErrorNotification } from "~utils/notifications";
import { useTranslation } from "react-i18next";

interface timeData {
  time: string;
  date: string;
}

type SectionKeys = "password" | "wallpaper" | "avatar";

const appNames: { [key: string]: string } = {
  appstore: "App Store",
  binunce: "Binunce",
  crack: "Smoke Crack",
  drone: "Drone",
  hq: "HQ",
  miner: "Miner",
  minerext: "Miner EXT",
  notes: "Notes",
  salty: "Salty",
  wally: "Wally",
};

const WifiBox = () => {
  const navigate = useNavigate();
  const [connectionTime, setConnectionTime] = useState<string | boolean>(false);
  const [displayTime, setDisplayTime] = useState("00:00:00");
  const { t } = useTranslation();

  useEffect(() => {
    fetchNui<string | boolean>(
      "fetchWifiConnectionTime",
      {},
      "2024-05-02 21:07:01"
    )
      .then((time) => {
        setConnectionTime(time);
      })
      .catch(() => {
        navigate("/");
      });
  }, [navigate]);

  useEffect(() => {
    if (!connectionTime) return;

    let interval: NodeJS.Timeout | null = null;

    interval = setInterval(() => {
      const curDate = new Date();
      const connDate = new Date(connectionTime as string);
      let diff = connDate.getTime() - curDate.getTime();
      const hours = Math.floor(diff / 1000 / 60 / 60);
      diff -= hours * 1000 * 60 * 60;
      const minutes = Math.floor(diff / 1000 / 60);
      diff -= minutes * 1000 * 60;
      const seconds = Math.floor(diff / 1000);

      setDisplayTime(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [connectionTime]); // Only re-run when showIplist changes

  return (
    <div className={style.wifiBox}>
      <div className={style.wifiInfo}>
        {connectionTime ? (
          <>
            {t("navbar.connected_for")} <br />
            {displayTime}
          </>
        ) : (
          t("navbar.not_connected")
        )}
      </div>
    </div>
  );
};

const ControlPanel = () => {
  const [activeSections, setActiveSections] = useState({
    password: false,
    wallpaper: false,
    avatar: false,
  });

  const toggleActive = (section: SectionKeys) => {
    setActiveSections((prev) => ({
      password: false,
      wallpaper: false,
      avatar: false,
      [section]: !prev[section],
    }));
  };

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  const [userData, setUserData] = useState({
    password: "",
    newPass: "",
    reNewPass: "",
  });

  const [wallpaperUrl, setWallpaperUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const { t } = useTranslation();

  const changePassword = () => {
    if (userData.newPass.length < 6) {
      SendErrorNotification(t("user.password_symbols"));
      return;
    }
    if (userData.newPass !== userData.reNewPass) {
      SendErrorNotification(t("user.password_match"));
      return;
    }

    fetchNui<DBResponse>(
      "changePassword",
      {
        password: userData.password,
        newPass: userData.newPass,
      },
      {
        0: true,
        1: "Successfully changed password",
      }
    )
      .then((res) => {
        if (res[0] == true) {
          fetchNui("hideFrame");
        } else if (res[0] == false && res[1]) {
          SendErrorNotification(res[1]);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const changeWallpaper = () => {
    if (!wallpaperUrl.includes("fivemanage.com")) {
      SendErrorNotification(t("navbar.invalid_url"));
      return;
    }

    fetchNui<DBResponse>("changeWallpaper", wallpaperUrl, {
      0: true,
      1: "Successfully changed wallpaper",
    })
      .then((res) => {
        if (res[0] == true) {
          fetchNui("hideFrame");
        } else if (res[0] == false && res[1]) {
          SendErrorNotification(res[1]);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const changeAvatar = () => {
    if (!avatarUrl.includes("fivemanage.com")) {
      SendErrorNotification(t("navbar.invalid_url"));
      return;
    }

    fetchNui<DBResponse>("changeAvatar", avatarUrl, {
      0: true,
      1: "Successfully changed avatar",
    })
      .then((res) => {
        if (res[0] == true) {
          fetchNui("hideFrame");
        } else if (res[0] == false && res[1]) {
          SendErrorNotification(res[1]);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className={style.controlPanel}>
      <div
        className={`${style.changePassword} ${
          activeSections.password && style.active
        }`}
        onClick={() => toggleActive("password")}
      >
        <div className={style.changePasswordTitle}>
          {t("navbar.change_password")}
        </div>
        <div
          className={`${style.passwordDrawer} ${
            activeSections.password && style.active
          }`}
        >
          <div
            className={style.userPasswordContainer}
            onClick={handleInputClick}
          >
            <input
              type="password"
              placeholder={t("navbar.curr_password")}
              className={style.userPassword}
              onChange={(e) => {
                setUserData({ ...userData, password: e.target.value });
              }}
            />
          </div>
          <div
            className={style.userPasswordContainer}
            onClick={handleInputClick}
          >
            <input
              type="password"
              placeholder={t("navbar.new_password")}
              className={style.userPassword}
              onChange={(e) => {
                setUserData({ ...userData, newPass: e.target.value });
              }}
            />
          </div>
          <div
            className={style.userConfirmPasswordContainer}
            onClick={handleInputClick}
          >
            <input
              type="password"
              placeholder={t("navbar.confirm_password")}
              className={style.userPassword}
              onChange={(e) => {
                setUserData({ ...userData, reNewPass: e.target.value });
              }}
            />
            <Icon
              id="login"
              className={style.loginIcon}
              onClick={changePassword}
            />
          </div>
        </div>
      </div>
      <div
        className={`${style.changeWallpaper} ${
          activeSections.wallpaper && style.active
        }`}
        onClick={() => toggleActive("wallpaper")}
      >
        <div className={style.changeWallpaperTitle}>
          {t("navbar.change_wallpaper")}
        </div>
        <div
          className={`${style.passwordDrawer} ${
            activeSections.wallpaper && style.active
          }`}
        >
          <div className={style.wallpaperUrl} onClick={handleInputClick}>
            <input
              type="text"
              placeholder={t("navbar.wallpaper_url")}
              className={style.wallpaperUrlInput}
              onChange={(e) => {
                setWallpaperUrl(e.target.value);
              }}
            />
            <Icon
              id="login"
              className={style.loginIcon}
              onClick={changeWallpaper}
            />
          </div>
        </div>
      </div>
      <div
        className={`${style.changeAvatar} ${
          activeSections.avatar && style.active
        }`}
        onClick={() => toggleActive("avatar")}
      >
        <div className={style.changeAvatarTitle}>{t("navbar.change_pfp")}</div>
        <div
          className={`${style.passwordDrawer} ${
            activeSections.avatar && style.active
          }`}
        >
          <div className={style.avatarUrl} onClick={handleInputClick}>
            <input
              type="text"
              placeholder={t("navbar.pfp_url")}
              className={style.avatarUrlInput}
              onChange={(e) => {
                setAvatarUrl(e.target.value);
              }}
            />
            <Icon
              id="login"
              className={style.loginIcon}
              onClick={changeAvatar}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const NavBar = () => {
  const location = useLocation();
  const appNameFromRoute = location.pathname.split("/")[1];
  const currentApp = appNameFromRoute;
  const [time, setTime] = useState("10:15 PM");
  const [date, setDate] = useState("Mon, Jan 1");
  const [wifi, setWifi] = useState(false);
  const [controlPanel, setControlPanel] = useState(false);
  // const [connected, setConnected] = useState(false);
  const { t } = useTranslation();

  useNuiEvent<timeData>("setTime", (data) => {
    setTime(data.time);
    setDate(data.date);
  });

  const handleWifi = () => {
    if (controlPanel) setControlPanel(false);
    setWifi(!wifi);
  };

  const handleControlPanel = () => {
    if (wifi) setWifi(false);
    setControlPanel(!controlPanel);
  };

  return (
    <>
      {wifi && <WifiBox />}
      {controlPanel && <ControlPanel />}
      <div className={style.navBar}>
        <div className={style.logo}>
          <img
            className={style.logoImage}
            src={logo}
            alt="Logo"
            draggable={false}
          />
        </div>
        <div className={style.navElements}>
          <div className={style.navMenu}>
            <div className={style.currentApp}>
              {currentApp ? appNames[currentApp] : t("navbar.file")}
            </div>
          </div>
          <div className={style.navUtils}>
            <div className={style.navWifi}>
              <Icon
                className={style.navWifiIcon}
                id="wifi"
                onClick={handleWifi}
              />
            </div>
            <div className={style.navSettings}>
              <Icon
                className={style.navSettingsIcon}
                id="settings"
                onClick={handleControlPanel}
              />
            </div>
            <div className={style.navDate}>
              <p>{`${date} ${time}`}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
