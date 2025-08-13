import React from "react";
import Dashboard from "../pages/Dashboard";
import UserProfile from "../pages/UserProfile";

export const userRoutes = [
  { path: "/user/dashboard", element: <Dashboard /> },
  { path: "/user/profile", element: <UserProfile /> },
];
