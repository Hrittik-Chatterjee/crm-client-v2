import { lazy } from "react";
import type { ISidebarItem } from "@/types";

const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const WriteContent = lazy(() => import("@/pages/dashboard/WriteContent"));
const Businesses = lazy(() => import("@/pages/dashboard/Businesses"));
const Links = lazy(() => import("@/pages/dashboard/Links"));

export const regularUserSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        component: Dashboard,
      },
      {
        title: "Write Content",
        url: "/dashboard/write",
        component: WriteContent,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Businesses",
        url: "/dashboard/businesses",
        component: Businesses,
      },
      {
        title: "Links",
        url: "/dashboard/links",
        component: Links,
      },
    ],
  },
];
