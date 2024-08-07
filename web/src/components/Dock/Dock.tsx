import { useNavigate } from "react-router-dom";
import Icon from "../../utils/icon";
import Tooltip from "../Tooltip/Tooltip";

import style from "./Dock.module.scss";
import { useEffect, useState } from "react";
import { fetchNui } from "~utils/fetchNui";
import { SendErrorNotification } from "~utils/notifications";
import { DBResponse } from "~types/Global";

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

const Dock = () => {
  const navigate = useNavigate();
  const [loadedAppsDock, setLoadedAppsDock] = useState(false);
  const [apps, setApps] = useState<AppDataObject>({});

  useEffect(() => {
    fetchNui<AppDataObject>(
      "fetchInstalledApps",
      {},
      {
        binunce: {
          appid: 1,
          appname: "Binunce",
          appiconid: "binunce",
          description: "Crypto transactions, exchange and more",
          price: 0.0,
        },
        crack: {
          appid: 2,
          appname: "Smoke Crack",
          appiconid: "crack",
          description: "Ipconfig simplified",
          price: 1.0,
        },
        drone: {
          appid: 3,
          appname: "Drone",
          appiconid: "drone",
          description: "Fly a drone",
          price: 0.0,
          disabled: true,
        },
        hq: {
          appid: 4,
          appname: "HQ",
          appiconid: "hq",
          description: "Manage the HQ and unlock new features",
          price: 0.0,
        },
        miner: {
          appid: 5,
          appname: "Miner",
          appiconid: "miner",
          description:
            "Mine cryptocurrency. Upgrade GPU on the rack to mine faster",
          price: 0.0,
        },
        minerext: {
          appid: 6,
          appname: "MinerEXT",
          appiconid: "minerext",
          description: "Monitor and control your mining rig",
          price: 0.0,
        },
        notes: {
          appid: 7,
          appname: "Notes",
          appiconid: "notes",
          description: "All your thoughts and ideas in one place",
          price: 0.0,
        },
        salty: {
          appid: 8,
          appname: "Salty",
          appiconid: "salty",
          description: "Scan for accessible networks",
          price: 3.0,
        },
        wally: {
          appid: 9,
          appname: "Wally",
          appiconid: "wally",
          description: "Your crypto wallet",
          price: 0.0,
        },
        noid: {
          appid: 10,
          appname: "Noid",
          appiconid: "noid",
          description: "Your crypto wallet",
          price: 0.0,
        },
        sniff: {
          appid: 11,
          appname: "Sniff",
          appiconid: "sniff",
          description: "Your crypto wallet",
          price: 0.0,
        },
      }
    )
      .then((data) => {
        setApps(data);
        setLoadedAppsDock(true);
      })
      .catch(() => {
        navigate("/");
      });
  }, [navigate, loadedAppsDock]);

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

  return (
    <div className={style.dockContainer}>
      <div className={style.dockItem}>
        <Tooltip content="App Store">
          <Icon
            id="appstore"
            className={style.iconAppstore}
            onClick={() => navigate(`/appstore`)}
          />
        </Tooltip>
      </div>
      {Object.entries(apps).map(([key, app]) => (
        <div key={key} className={style.dockItem}>
          <Tooltip content={app.appname}>
            {app.appiconid.includes("http") ? (
              <img
                src={app.appiconid}
                alt={app.appname}
                className={style.iconGeneral}
                onClick={() => openApp(key, `/${key}`)}
              />
            ) : (
              <Icon
                id={key}
                className={
                  style[
                    `icon${
                      app.appiconid.charAt(0).toUpperCase() +
                      app.appiconid.slice(1)
                    }`
                  ]
                }
                onClick={() => openApp(key, `/${key}`)}
              />
            )}
          </Tooltip>
        </div>
      ))}
    </div>
  );
};

export default Dock;
