import { useState, useEffect } from "react";
import Window from "../../../components/Window/Window";
import style from "./binunce.module.scss";
import { fetchNui } from "~utils/fetchNui";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface BinunceItem {
  senderUsername: string;
  senderAddress: string;
  receiverAddress: string;
  macAddress: string;
  amount: string;
}

const Binunce: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<BinunceItem[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    fetchNui<BinunceItem[]>("fetchBinunceTransactions", {}, [
      {
        senderUsername: "ac_pixelJIYEfE9G3s3g",
        senderAddress: "0x322E5ED07276",
        receiverAddress: "0x322E5ED07276",
        macAddress: "E5:4D:30:5E:EB:82",
        amount: "2",
      },
      {
        senderUsername: "ac_pixelJIYEfE9G3s3g",
        senderAddress: "0x322E5ED07276",
        receiverAddress: "0x322E5ED07276",
        macAddress: "E5:4D:30:5E:EB:82",
        amount: "2",
      },
      {
        senderUsername: "ac_pixelJIYEfE9G3s3g",
        senderAddress: "0x322E5ED07276",
        receiverAddress: "0x322E5ED07276",
        macAddress: "E5:4D:30:5E:EB:82",
        amount: "2",
      },
      {
        senderUsername: "ac_pixelJIYEfE9G3s3g",
        senderAddress: "0x322E5ED07276",
        receiverAddress: "0x322E5ED07276",
        macAddress: "E5:4D:30:5E:EB:82",
        amount: "2",
      },
      {
        senderUsername: "ac_pixelJIYEfE9G3s3g",
        senderAddress: "0x322E5ED07276",
        receiverAddress: "0x322E5ED07276",
        macAddress: "E5:4D:30:5E:EB:82",
        amount: "2",
      },
      {
        senderUsername: "ac_pixelJIYEfE9G3s3g",
        senderAddress: "0x322E5ED07276",
        receiverAddress: "0x322E5ED07276",
        macAddress: "E5:4D:30:5E:EB:82",
        amount: "2",
      },
      {
        senderUsername: "ac_pixelJIYEfE9G3s3g",
        senderAddress: "0x322E5ED07276",
        receiverAddress: "0x322E5ED07276",
        macAddress: "E5:4D:30:5E:EB:82",
        amount: "2",
      },
      {
        senderUsername: "ac_pixelJIYEfE9G3s3g",
        senderAddress: "0x322E5ED07276",
        receiverAddress: "0x322E5ED07276",
        macAddress: "E5:4D:30:5E:EB:82",
        amount: "2",
      },
      {
        senderUsername: "ac_pixelJIYEfE9G3s3g",
        senderAddress: "0x322E5ED07276",
        receiverAddress: "0x322E5ED07276",
        macAddress: "E5:4D:30:5E:EB:82",
        amount: "2",
      },
      {
        senderUsername: "ac_pixelJIYEfE9G3s3g",
        senderAddress: "0x322E5ED07276",
        receiverAddress: "0x322E5ED07276",
        macAddress: "E5:4D:30:5E:EB:82",
        amount: "2",
      },
      {
        senderUsername: "ac_pixelJIYEfE9G3s3g",
        senderAddress: "0x322E5ED07276",
        receiverAddress: "0x322E5ED07276",
        macAddress: "E5:4D:30:5E:EB:82",
        amount: "2",
      },
      {
        senderUsername: "ac_pixelJIYEfE9G3s3g",
        senderAddress: "0x322E5ED07276",
        receiverAddress: "0x322E5ED07276",
        macAddress: "E5:4D:30:5E:EB:82",
        amount: "2",
      },
      {
        senderUsername: "ac_pixelJIYEfE9G3s3g",
        senderAddress: "0x322E5ED07276",
        receiverAddress: "0x322E5ED07276",
        macAddress: "E5:4D:30:5E:EB:82",
        amount: "2",
      },
      {
        senderUsername: "ac_pixelJIYEfE9G3s3g",
        senderAddress: "0x322E5ED07276",
        receiverAddress: "0x322E5ED07276",
        macAddress: "E5:4D:30:5E:EB:82",
        amount: "2",
      },
      {
        senderUsername: "ac_pixelJIYEfE9G3s3g",
        senderAddress: "0x322E5ED07276",
        receiverAddress: "0x322E5ED07276",
        macAddress: "E5:4D:30:5E:EB:82",
        amount: "2",
      },
      {
        senderUsername: "ac_pixelJIYEfE9G3s3g",
        senderAddress: "0x322E5ED07276",
        receiverAddress: "0x322E5ED07276",
        macAddress: "E5:4D:30:5E:EB:82",
        amount: "2",
      },
    ])
      .then((data) => {
        setItems(data);
      })
      .catch(() => {
        navigate("/");
      });
  }, [navigate]);

  return (
    <Window>
      <div className={style.binunce}>
        <div className={style.binunceTableHeader}>
          <div>{t("binunce.snd_username")}</div>
          <div>{t("binunce.snd_address")}</div>
          <div>{t("binunce.rcv_address")}</div>
          <div>{t("binunce.rcv_mac_address")}</div>
          <div>{t("binunce.amount")}</div>
        </div>
        <div className={style.binunceTableContent}>
          {items.length > 0 &&
            items?.map((item, index) => (
              <div className={style.binunceTableRow} key={index}>
                <div>{item.senderUsername}</div>
                <div>{item.senderAddress}</div>
                <div>{item.receiverAddress}</div>
                <div>{item.macAddress}</div>
                <div className={style.amount}>{item.amount}</div>
              </div>
            ))}

          {items.length <= 0 && (
            <div
              style={{
                color: "white",
                fontSize: "24px",
              }}
            >
              {t("binunce.no_transactions")}
            </div>
          )}
        </div>
      </div>
    </Window>
  );
};

export default Binunce;
