import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Sidebar, { NavItem } from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { HomeIcon, LogOut, UserIcon, Users2 } from "lucide-react";
import { COMPANY_NAME } from "../../constants";
import { api } from "../../utils/api";

const DashboardLayout: React.FC = () => {
  const userRole = localStorage.getItem("userRole");
  const username = localStorage.getItem("userName");

  const [userFullName, setUserFullName] = useState("");
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [profilePath, setProfilePath] = useState("");

  const navigate = useNavigate();

  // ✅ Fetch full name on mount
  useEffect(() => {
    const getUserName = async () => {
      try {
        const response = await api(`/user/fullName/${username}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        
        setUserFullName(`${response.firstName} ${response.lastName}`);        
      } catch (err) {
        console.error("Failed to fetch user full name", err);
      }
    };

    getUserName();
  }, [username]);

  // ✅ Setup nav items based on role
  useEffect(() => {
    const items: NavItem[] = [{ label: "Dashboard", path: "/dashboard", icon: <HomeIcon /> }];

    if (userRole === "ADMIN") {
      setProfilePath("/admin/profile");
      items.push(
        { label: "Employees", path: "/admin/employee-management", icon: <Users2 /> },
        { label: "Profile", path: "/admin/profile", icon: <UserIcon /> }
      );
    } else if (userRole === "USER") {
      setProfilePath("/user/profile");
      items.push({ label: "Profile", path: "/user/profile", icon: <UserIcon /> });
    } else if (userRole === "EMPLOYEE") {
      setProfilePath("/employee/profile");
      items.push({ label: "Profile", path: "/employee/profile", icon: <UserIcon /> });
    }

    setNavItems(items);
  }, [userRole]);

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
        <div className="h-16">
          <Navbar
            companyName={COMPANY_NAME}
            userName={userFullName}
            notifications={["Test 1", "Test 2"]}
            onUserClick={() => navigate(profilePath)}
            onNotificationClick={() => console.log("Notifications clicked")}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
