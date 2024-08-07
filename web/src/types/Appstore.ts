export type App = {
  appName: string;
  appImg: string;
  appDesc: string;
  appType?: string;
  appCoin?: number;
};

export type AppStoreData = {
  AppStore: App[];
};

export type MyData = {
  apps: App[];
};
