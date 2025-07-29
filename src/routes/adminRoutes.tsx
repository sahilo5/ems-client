import React from "react";
import Dashboard from "../pages/Dashboard";
import Profiles from "../pages/Profiles";
import UserManagement from "../pages/users/UserManagement";

export const adminRoutes = [
  { path: "/admin/dashboard", element: <Dashboard /> },
  { path: "/admin/profile", element: <Profiles /> },
  { path: "/admin/employee-management", element: <UserManagement /> },
];
