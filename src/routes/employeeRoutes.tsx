import React from "react";
import Dashboard from "../pages/Dashboard";
import Profiles from "../pages/Profiles";

export const employeeRoutes = [
  { path: "/empoloyee/dashboard", element: <Dashboard /> },
  { path: "/empoloyee/profile", element: <Profiles /> },
];
