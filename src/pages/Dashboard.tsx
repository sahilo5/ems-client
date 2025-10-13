import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import React from "react";
import AdminDashboard from "./admin/AdminDashboard";
import EmployeeDashboard from "./employee/EmployeeDashboard";
import UserDashboard from "./user/UserDashboard";

const Dashboard: React.FC = () => {
  const { role, username } = useContext(AuthContext);

  return (
    <div className="p-2">
      {role === "ADMIN" && <AdminDashboard />}
      {role === "EMPLOYEE" && <EmployeeDashboard username={username!} />}
      {role === "USER" && <UserDashboard />}
    </div>
  );
};

export default Dashboard;
