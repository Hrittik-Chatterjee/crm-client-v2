import { lazy } from "react";
import type { ISidebarItem } from "@/types";

const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AddBusiness = lazy(() => import("@/pages/admin/AddBusiness"));
const ManageBusinesses = lazy(() => import("@/pages/admin/ManageBusinesses"));

export const adminSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Admin Dashboard",
        url: "/admin/dashboard",
        component: AdminDashboard,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Add Business",
        url: "/admin/add-business",
        component: AddBusiness,
      },
      {
        title: "Manage Businesses",
        url: "/admin/businesses",
        component: ManageBusinesses,
      },
    ],
  },
];
