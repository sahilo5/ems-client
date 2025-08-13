import React from "react";
import Dashboard from "../pages/Dashboard";
import UserProfile from "../pages/UserProfile";

export const employeeRoutes = [
  { path: "/empoloyee/dashboard", element: <Dashboard /> },
  { path: "/empoloyee/profile", element: <UserProfile /> },
];
