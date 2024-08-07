import { ReactNode, lazy } from "react";

const Empty = lazy(() => import("./Empty"));
const Appstore = lazy(() => import("./apps/Appstore/appstore"));
const Binunce = lazy(() => import("./apps/Binunce/binunce"));
const Crack = lazy(() => import("./apps/Crack/crack"));
const Drone = lazy(() => import("./apps/Drone/drone"));
const HQ = lazy(() => import("./apps/HQ/hq"));
const Miner = lazy(() => import("./apps/Miner/miner"));
const MinerExt = lazy(() => import("./apps/MinerExt/MinerExt"));
const Notes = lazy(() => import("./apps/Notes/notes"));
const Salty = lazy(() => import("./apps/Salty/salty"));
const Wally = lazy(() => import("./apps/Wally/wally"));
const Robbery = lazy(() => import("./apps/HQ/Pages/robbery"));
const Weed = lazy(() => import("./apps/HQ/Pages/weed"));
const Hire = lazy(() => import("./apps/HQ/Pages/hire"));
const Strains = lazy(() => import("./apps/HQ/Pages/strains"));
const Turfs = lazy(() => import("./apps/HQ/Pages/turfs"));
const Members = lazy(() => import("./apps/HQ/Pages/members"));
const Announcements = lazy(() => import("./apps/HQ/Pages/announcements"));
const Join = lazy(() => import("./apps/HQ/Pages/join"));
const Noid = lazy(() => import("./apps/Noid/noid"));
const Sniff = lazy(() => import("./apps/Sniff/sniff"));

// const Welcome = lazy(() => import('./apps/Appstore/Pages/Welcome'));
// import Welcome from './apps/Appstore/Pages/Welcome';
// const AppDetails = lazy(() => import('./apps/Appstore/Pages/AppDetails'));

// import Appstore from './apps/Appstore/appstore';
// import Binunce from './apps/Binunce/binunce';
// import Crack from './apps/Crack/crack';
// import Drone from './apps/Drone/drone';
// import HQ from './apps/HQ/hq';
// import Miner from './apps/Miner/miner';
// import MinerExt from './apps/MinerExt/MinerExt';
// import Notes from './apps/Notes/notes';
// import Salty from './apps/Salty/salty';
// import Wally from './apps/Wally/wally';

// import Profile from './views/Profile';
// import Settings from './views/Settings';

// const Admin = lazy(() => import('./views/Admin'));
// const Restricted = lazy(() => import('./views/Restricted'));

interface Route {
  path: string;
  element: ReactNode;
  children?: Route[];
}

export const publicRoutes: Route[] = [
  {
    path: "/",
    element: <Empty />,
  },
  {
    path: "/appstore",
    element: <Appstore />,
    // children: [
    //   {
    //     path: 'welcome',
    //     element: <Welcome />,
    //   },
    //   {
    //     path: '/appstore/:appName',
    //     element: <AppDetails />,
    //   },
    // ],
  },
  {
    path: "/binunce",
    element: <Binunce />,
  },
  {
    path: "/crack",
    element: <Crack />,
  },
  {
    path: "/drone",
    element: <Drone />,
  },
  {
    path: "/hq/*",
    element: <HQ />,
    children: [
      {
        path: "robbery/*",
        element: <Robbery />,
        children: [{ path: ":category", element: <Robbery /> }],
      },
      {
        path: "weed",
        element: <Weed />,
      },
      {
        path: "hire",
        element: <Hire />,
      },
      {
        path: "strains",
        element: <Strains />,
      },
      {
        path: "turfs",
        element: <Turfs />,
      },
      {
        path: "members",
        element: <Members />,
      },
      {
        path: "announcements",
        element: <Announcements />,
      },
      {
        path: "join/*",
        element: <Join />,
      },
    ],
  },
  {
    path: "/miner",
    element: <Miner />,
  },
  {
    path: "/minerext",
    element: <MinerExt />,
  },
  {
    path: "/notes",
    element: <Notes />,
  },
  {
    path: "/salty",
    element: <Salty />,
  },
  {
    path: "/wally",
    element: <Wally />,
  },
  {
    path: "/noid",
    element: <Noid />,
  },
  {
    path: "/sniff",
    element: <Sniff />,
  },
  {
    path: "*",
    element: <Empty />,
  },
];

// export const privateRoutes: Route[] = [
//   {
//     path: '/admin',
//     element: <Admin />,
//   },
// ];
