import React from "react";
import Dashboard from "../pages/Dashboard";
import Profiles from "../pages/Profiles";

const userRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/user/profile", element: <Profiles /> },
];

export default userRoutes;
