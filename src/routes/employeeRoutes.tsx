import React from "react";
import Dashboard from "../pages/Dashboard";
import UserProfile from "../pages/UserProfile";

export const employeeRoutes = [
  { path: "/employee/dashboard", element: <Dashboard /> },
  { path: "/employee/profile", element: <UserProfile /> },
];
