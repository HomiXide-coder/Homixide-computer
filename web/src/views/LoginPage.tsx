import { useEffect, useState } from "react";
import Icon from "~utils/icon";
import style from "./styles/LoginPage.module.scss";
import { fetchNui } from "~utils/fetchNui";
import {
  SendErrorNotification,
  SendSuccessNotification,
} from "~utils/notifications";
import { DBResponse } from "~types/Global";
import { useTranslation } from "react-i18next";

interface UserData {
  username: string;
  password: string;
  rePass?: string;
}

interface FetchedUser {
  isSetup: boolean;
  username: string;
  password: string;
}

interface Callback {
  callback: (resp: boolean) => void;
}

const LoginPage: React.FC<Callback> = ({ callback }) => {
  const { t } = useTranslation();

  const [isRegistered, setIsRegistered] = useState(true);
  const [fetchedUser, setFethcedUser] = useState(false);
  const [avatar, setAvatar] = useState<string>("");

  const [userData, setUserData] = useState<UserData>({
    username: "",
    password: "",
    rePass: "",
  });

  useEffect(() => {
    if (fetchedUser) return;

    fetchNui<FetchedUser>(
      "fetchIsRegistered",
      {},
      {
        isSetup: true,
        username: "KRISI",
        password: "123456",
      }
    )
      .then((resp) => {
        if (resp.isSetup) {
          setIsRegistered(true);
          setUserData({ ...userData, username: resp.username });
        } else {
          setIsRegistered(false);
        }

        setFethcedUser(true);
      })
      .catch(() => {
        fetchNui("hideFrame");
      });
  }, [userData, fetchedUser]);

  useEffect(() => {
    fetchNui<string>(
      "fetchAvatar",
      {},
      "https://r2.fivemanage.com/pub/1nhoxwewu2f3.jpg"
    )
      .then((resp) => {
        setAvatar(resp);
      })
      .catch(() => {
        fetchNui("hideFrame");
      });
  });

  const loginUser = (e?: SubmitEvent) => {
    e?.preventDefault();

    if (userData.password.length < 6) {
      SendErrorNotification(t("user.password_symbols"));
      return;
    }

    fetchNui<DBResponse>("loginUser", userData, {
      0: true,
      1: "User Logged In Successfully!",
    }).then((resp) => {
      if (resp[0] == true && resp[1]) {
        SendSuccessNotification(resp[1]);
        callback(true);
      } else if (resp[0] == false && resp[1]) {
        SendErrorNotification(resp[1]);
      }
    });
  };

  const registerUser = (e?: SubmitEvent) => {
    e?.preventDefault();

    if (userData.username.length < 5 || userData.username.length > 15) {
      SendErrorNotification(t("user.username_symbols"));
      return;
    }
    if (userData.password.length < 6) {
      SendErrorNotification(t("user.password_symbols"));
      return;
    }
    if (userData.password !== userData.rePass) {
      SendErrorNotification(t("user.password_match"));
      return;
    }

    fetchNui<DBResponse>("registerUser", userData, {
      0: true,
      1: "User Registered Successfully!",
    })
      .then((resp: DBResponse) => {
        if (resp[0] == true && resp[1]) {
          setIsRegistered(true);
          SendSuccessNotification(resp[1]);
        } else if (resp[0] == false && resp[1]) {
          SendErrorNotification(resp[1]);
        }
      })
      .catch(() => {
        fetchNui("hideFrame");
      });
  };

  return (
    <div className={style.loginPageContainer}>
      {isRegistered ? (
        <form className={style.loginPageContent} onSubmit={loginUser}>
          <div className={style.userAvatar}>
            <img src={avatar} alt="" className={style.avatarImage} />
          </div>
          <div className={style.userName}>{userData.username}</div>
          <div className={style.userPasswordContainer}>
            <input
              type="password"
              placeholder={t("user.password_placeholder")}
              className={style.userPassword}
              autoFocus
              onChange={(e) => {
                setUserData({ ...userData, password: e.target.value });
              }}
            />
            <Icon id="login" className={style.loginIcon} onClick={loginUser} />
          </div>
        </form>
      ) : (
        <>
          <form className={style.loginPageContent} onSubmit={registerUser}>
            <div className={style.userNameContainer}>
              <input
                type="text"
                placeholder={t("user.username_placeholder")}
                autoFocus
                className={style.userPassword}
                onChange={(e) => {
                  setUserData({ ...userData, username: e.target.value });
                }}
              />
            </div>
            <div className={style.userPasswordContainer}>
              <input
                type="password"
                placeholder={t("user.password_placeholder")}
                className={style.userPassword}
                onChange={(e) => {
                  setUserData({ ...userData, password: e.target.value });
                }}
              />
            </div>
            <div className={style.userConfirmPasswordContainer}>
              <input
                type="password"
                placeholder={t("user.password_re_placeholder")}
                className={style.userPassword}
                onChange={(e) => {
                  setUserData({ ...userData, rePass: e.target.value });
                }}
              />
              <Icon
                id="login"
                className={style.loginIcon}
                onClick={registerUser}
              />
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default LoginPage;
