import { createBrowserRouter, Navigate } from "react-router";
import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Login from "@/pages/Login";
import Unauthorized from "@/pages/Unauthorized";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/dashboard/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";
import { withAuth } from "@/utils/withAuth";
import { role } from "@/constants/role";

// Create protected layouts
// Common dashboard - all authenticated users
const ProtectedDashboardLayout = withAuth(DashboardLayout);
// Admin dashboard - only super admin and admin
const AdminDashboardLayout = withAuth(DashboardLayout, [role.superAdmin, role.admin]);

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
    ],
  },
  {
    Component: ProtectedDashboardLayout,
    path: "/dashboard",
    children: [
      { index: true, Component: Dashboard },
    ],
  },
  {
    Component: AdminDashboardLayout,
    path: "/admin",
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" /> },
      { path: "dashboard", Component: AdminDashboard },
    ],
  },
  {
    Component: Login,
    path: "login",
  },
  {
    Component: Unauthorized,
    path: "/unauthorized",
  },
  {
    Component: NotFound,
    path: "*",
  },
]);
