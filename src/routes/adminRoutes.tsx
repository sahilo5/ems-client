import React from "react";
import Dashboard from "../pages/Dashboard";
import Profiles from "../pages/Profiles";

const adminRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/admin/profile", element: <Profiles /> },
];

export default adminRoutes;
