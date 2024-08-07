import React from "react";
import { useSelector } from "react-redux";
import AppInstallModal from "./AppInstallModal";
import SendCryptoModal from "./SendCryptoModal";
import ReceiveCryptoModal from "./ReceiveCryptoModal";
import InviteMemberModal from "./InviteMemberModal";
import StrainNameModal from "./StrainNameModal";
import CreateAnnouncement from "./CreateAnnouncement";
import Announcement from "./Announcement";
import { RootState } from "~/store/store";

import style from "./styles/Modal.module.scss";

const Modal: React.FC = () => {
  const modal = useSelector((store: RootState) => store.modal.modal);

  if (!modal) return null;

  let modalContent = null;
  switch (modal.type) {
    case "AppInstallModal":
      modalContent = <AppInstallModal data={modal.data} />;
      break;
    case "SendCryptoModal":
      modalContent = <SendCryptoModal />;
      break;
    case "ReceiveCryptoModal":
      modalContent = <ReceiveCryptoModal />;
      break;
    case "InviteMemberModal":
      modalContent = <InviteMemberModal />;
      break;
    case "StrainNameModal":
      modalContent = <StrainNameModal />;
      break;
    case "CreateAnnouncement":
      modalContent = <CreateAnnouncement />;
      break;
    case "Announcement":
      modalContent = <Announcement data={modal.data} />;
      break;
    default:
      modalContent = <div>Default Modal Content</div>;
      break;
  }

  return (
    <div className={style.modalContainer}>
      <div className={style.modal}>{modalContent}</div>
    </div>
  );
};

export default Modal;
