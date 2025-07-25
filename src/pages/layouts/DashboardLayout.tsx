import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Sidebar, { NavItem } from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { HomeIcon, LogOut, UserIcon } from "lucide-react";

const userRole = localStorage.getItem("userRole");

const DashboardLayout: React.FC = () => {
  const navItems: NavItem[] = [
    { label: "Dashboard", path: "/dashboard", icon: <HomeIcon /> },
    { label: "Employees", path: "/dashboard", icon: <HomeIcon /> },
    { label: "Profile", path: "/admin/profile", icon: <UserIcon /> },
  ];

  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <Sidebar
        navItems={navItems}
        logoutLabel="Sign out"
        logoutIcon={<LogOut className="w-4 h-4" />}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 bg-light overflow-hidden">
        {/* Navbar (optional fixed height) */}
        <div className="h-16">
          <Navbar
            companyName="Company Name"
            userName="Sahil Deshmukh"
            notifications={["Test 1", "Test 2"]}
            onUserClick={() => navigate("/admin/profile")}
            onNotificationClick={() => console.log("Notifications clicked")}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
