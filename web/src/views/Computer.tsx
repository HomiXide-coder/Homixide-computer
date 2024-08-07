import { Suspense, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { RootState } from "~/store/store";

import { debugData } from "~utils/debugData";

import FallbackLoading from "../components/Loader/FallbackLoading";
import LoginPage from "./LoginPage";
import NavBar from "../components/NavBar/NavBar";
import Dock from "../components/Dock/Dock";
import Modal from "~components/Modal/Modal";
import { publicRoutes } from "./routes";
import { useNuiEvent } from "~hooks/useNuiEvent";

import style from "./styles/Computer.module.scss";
import {
  SendErrorNotification,
  SendSuccessNotification,
} from "~utils/notifications";
import { loadLocale } from "~/i18n/config";
import { fetchNui } from "~utils/fetchNui";

interface SendNotification {
  type: "success" | "error";
  message: string;
}

debugData([
  {
    action: "openComputer",
    data: "https://r2.fivemanage.com/pub/4m02sqtf01yu.jpg",
  },
]);

const Computer = () => {
  const navigate = useNavigate();
  const { isOpen } = useSelector((store: RootState) => store.modal);
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [wallpaper, setWallpaper] = useState<string>("");

  useNuiEvent("openComputer", (wallpaper: string) => {
    setIsLoading(false);
    setIsLogged(false);
    setWallpaper(wallpaper);

    setLanguage();
  });

  const setLanguage = () => {
    fetchNui("setLanguage", null, {
      language: "en",
      translations: {},
    }).then((data) => {
      loadLocale(data.language, data.translations);
    });
  };

  useNuiEvent("closeComputer", () => {
    setIsLoading(true);
    setIsLogged(false);
    navigate("/");
  });

  useNuiEvent<SendNotification>("sendNotification", (data) => {
    if (data.type === "success") {
      SendSuccessNotification(data.message);
    } else {
      SendErrorNotification(data.message);
    }
  });

  return isLogged && !isLoading ? (
    <div className={style.computerContainer}>
      {isOpen && <Modal />}
      <img src={wallpaper} alt="" className={style.backgroundImage} />
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerStyle={{
          position: "absolute",
          right: "10px",
          top: "10px",
        }}
      />
      <NavBar />
      <Suspense fallback={<FallbackLoading />}>
        <Routes>
          {/* <Route element={<Restricted />}>
              {privateRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Route> */}

          {publicRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element}>
              {route.children &&
                route.children.map((childRoute, childIndex) => (
                  <Route
                    key={childIndex}
                    path={childRoute.path}
                    element={childRoute.element}
                  />
                ))}
            </Route>
          ))}

          {/* <Route path='/admin' element={isAdmin ? <div>Admin page</div> : <Navigate to='/home' />} /> */}
        </Routes>
      </Suspense>
      <Dock />
    </div>
  ) : (
    !isLogged && !isLoading && (
      <>
        <Toaster
          position="top-right"
          reverseOrder={false}
          containerStyle={{
            position: "absolute",
            right: "10px",
            top: "10px",
          }}
        />
        <LoginPage
          callback={(loggedIn) => {
            setIsLogged(loggedIn);
          }}
        />
      </>
    )
  );
};

export default Computer;
