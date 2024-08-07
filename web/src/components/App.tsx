import Computer from "../views/Computer";

import style from "./App.module.scss";
import { debugData } from "../utils/debugData";

debugData([
  {
    action: "setVisible",
    data: true,
  },
]);

const App = () => {
  return (
    <div className={style.nuiWrapper}>
      <Computer />
    </div>
  );
};

export default App;
