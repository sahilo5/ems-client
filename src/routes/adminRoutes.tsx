import React from "react";
import Dashboard from "../pages/Dashboard";
import Profiles from "../pages/Profiles";
import EmpoloyeeManagement from "../pages/admin/employeeManagement";

const adminRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/admin/profile", element: <Profiles /> },
  { path: "/admin/employee-management", element: <EmpoloyeeManagement /> },
];

export default adminRoutes;
