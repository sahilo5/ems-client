import React from "react";
import Dashboard from "../pages/Dashboard";
import UserProfile from "../pages/UserProfile";
import LeaveManagement from "../pages/employee/LeaveManagement";

export const employeeRoutes = [
  { path: "/employee/dashboard", element: <Dashboard /> },
  { path: "/employee/profile", element: <UserProfile /> },
  { path: "/employee/leave-management", element: <LeaveManagement /> },
];
