import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar, { NavItem } from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import { CalendarCheck2Icon, CalendarCheckIcon, CheckSquare2, DoorOpen, HomeIcon, LogOut, LogOutIcon, PinOff, Settings, UserIcon, Users2 } from "lucide-react";
import { COMPANY_NAME } from "../../constants";
import { api } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";

const DashboardLayout: React.FC = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [userFullName, setUserFullName] = useState("");
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [profilePath, setProfilePath] = useState("");
  const { role, token, username } = useContext(AuthContext);

  useEffect(() => {
    const init = async () => {

      if (!role || !username) {
        navigate("/login");
        return;
      }

      try {
        // Fetch full name
        const response = await api(`/user/fullName/${username}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setUserFullName(`${response.firstName} ${response.lastName}`);

        // Set nav and profile path
        const items: NavItem[] = [];

        if (role === "ADMIN") {
          items.push(
            { label: "Dashboard", path: "/admin/dashboard", icon: <HomeIcon /> },
            { label: "Employees", path: "/admin/employee-management", icon: <Users2 /> },
            { label: "Attendance", path: "/admin/attendance-management", icon: <CalendarCheckIcon /> },
            { label: "Leave", path: "/admin/leave-management", icon: <DoorOpen /> },
            { label: "Settings", path: "/admin/settings", icon: <Settings /> },
            { label: "Profile", path: "/admin/profile", icon: <UserIcon /> },
          );
          setProfilePath("/admin/profile");
        } else if (role === "USER") {
          items.push(
            { label: "Dashboard", path: "/user/dashboard", icon: <HomeIcon /> },
            { label: "Profile", path: "/user/profile", icon: <UserIcon /> }
          );
          setProfilePath("/user/profile");
        } else if (role === "EMPLOYEE") {
          items.push(
            { label: "Dashboard", path: "/employee/dashboard", icon: <HomeIcon /> },
            { label: "Leave", path: "/employee/leave-management", icon: <DoorOpen /> },
            { label: "Profile", path: "/employee/profile", icon: <UserIcon /> }
          );
          setProfilePath("/employee/profile");
        }

        setNavItems(items);
      } catch (err) {
        console.error("Setup failed:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigate]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-light">
        <Loader size={48} color="text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen">
      <Sidebar
        navItems={navItems}
        logoutLabel="Sign out"
        logoutIcon={<LogOut className="w-4 h-4" />}
      />
      <div className="flex flex-col flex-1 bg-light overflow-hidden">
        <div className="h-14">
          <Navbar
            companyName={COMPANY_NAME}
            userName={userFullName}
            onUserClick={() => navigate(profilePath)}
          />
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
