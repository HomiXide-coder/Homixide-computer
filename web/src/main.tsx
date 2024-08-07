import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { VisibilityProvider } from "./providers/VisibilityProvider";
import { Provider } from "react-redux";
import App from "./components/App";
import { store } from "./store/store";
import "./styles/reset.scss";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <VisibilityProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </VisibilityProvider>
  </React.StrictMode>
);
