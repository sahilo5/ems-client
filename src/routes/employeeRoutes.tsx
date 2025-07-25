import React from "react";
import Dashboard from "../pages/Dashboard";
import Profiles from "../pages/Profiles";

const employeeRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/employee/profile", element: <Profiles /> },
];

export default employeeRoutes;
