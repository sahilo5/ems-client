import React from "react";
import Dashboard from "../pages/Dashboard";
import UserProfile from "../pages/UserProfile";
import UserManagement from "../pages/admin/UserManagement";
import AttendanceManagement from "../pages/admin/AttendanceManagement";
import AdminLeaveManagement from "../pages/admin/AdminLeaveManagement";
import SettingsLayout from "../pages/layouts/SettingsLayout";
import SalaryManagement from "../pages/admin/SalaryManagement";
import Reports from "../pages/admin/Reports";

export const adminRoutes = [
  { path: "/admin/dashboard", element: <Dashboard /> },
  { path: "/admin/profile", element: <UserProfile /> },
  { path: "/admin/employee-management", element: <UserManagement /> },
  { path: "/admin/attendance-management", element: <AttendanceManagement /> },
  { path: "/admin/leave-management", element: <AdminLeaveManagement /> },
  { path: "/admin/settings", element: <SettingsLayout /> },
  { path: "/admin/salary-management", element: <SalaryManagement /> },
  { path: "/admin/reports", element: <Reports /> },
];
