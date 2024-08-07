import style from "./styles/loading.module.scss";
import Icon from "~utils/icon";
import { useTranslation } from "react-i18next";

const Loading = () => {
  const { t } = useTranslation();

  return (
    <div className={style.loadingWrapper}>
      <Icon id="market" className={style.icon} />
      <div className={style.desc}>{t("hq_loading.group")}</div>
      <div className={style.title}>HQ</div>
      <div className={style.loadingBar}>
        <hr className={style.loadingLine} />
        <span>{t("hq_loading.loading")}</span>
        <hr className={style.loadingLine} />
      </div>
      <div className={style.loadingText}>{t("hq_loading.loading_alt")}</div>
    </div>
  );
};

export default Loading;
