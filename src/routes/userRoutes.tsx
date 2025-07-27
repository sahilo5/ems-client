import React from "react";
import Dashboard from "../pages/Dashboard";
import Profiles from "../pages/Profiles";

export const userRoutes = [
  { path: "/user/dashboard", element: <Dashboard /> },
  { path: "/user/profile", element: <Profiles /> },
];
