export enum ModalType {
  AppInstallModal = "AppInstallModal",
  SendCryptoModal = "SendCryptoModal",
  ReceiveCryptoModal = "ReceiveCryptoModal",
  InviteMemberModal = "InviteMemberModal",
  StrainNameModal = "StrainNameModal",
  CreateAnnouncement = "CreateAnnouncement",
  Announcement = "Announcement",
}

export interface Modal {
  type: ModalType;
  data?: unknown;
}

export interface ModalData {
  data?: unknown;
}
