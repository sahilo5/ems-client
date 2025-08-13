import React from "react";
import Dashboard from "../pages/Dashboard";
import UserProfile from "../pages/UserProfile";
import UserManagement from "../pages/admin/UserManagement";

export const adminRoutes = [
  { path: "/admin/dashboard", element: <Dashboard /> },
  { path: "/admin/profile", element: <UserProfile /> },
  { path: "/admin/employee-management", element: <UserManagement /> },
];
