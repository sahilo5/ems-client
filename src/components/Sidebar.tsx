import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  Menu,
  Home as HomeIcon,
  Users2,
  User as UserIcon,
} from "lucide-react";
import Popup from "./Popup";

export type NavItem = {
  label: string;
  path: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

type SidebarProps = {
  navItems?: NavItem[];
  logoutLabel?: string;
  logoutIcon?: React.ReactNode;
  onClick?: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  navItems,
  logoutLabel = "Logout",
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Fallback default navItems if not provided
  const defaultNavItems: NavItem[] = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <HomeIcon /> },
    {
      label: "Employees",
      path: "/admin/employee-management",
      icon: <Users2 />,
    },
    { label: "Profile", path: "/admin/profile", icon: <UserIcon /> },
  ];

  const effectiveNavItems =
    navItems && navItems.length > 0 ? navItems : defaultNavItems;

  const handleLogout = () => {
    navigate("/login");
    localStorage.clear();
  };

  // Auto-navigate to first nav item if on base route
  useEffect(() => {
    const firstPath = effectiveNavItems[0]?.path;

    // Adjust this logic if your base layout route is different
    const isOnBaseRoute =
      location.pathname === "/admin" || location.pathname === "/";

    if (isOnBaseRoute && firstPath) {
      navigate(firstPath, { replace: true });
    }
  }, [location.pathname, effectiveNavItems, navigate]);

  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    handleLogout();
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={`${collapsed ? "w-15" : "w-40"
        } h-full backdrop-blur-lg bg-white/40 border-r-1 border-white/30 shadow-inner shadow-white/30 text-dark flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-none">
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-1.5 text-mid-gray hover:bg-white/30 hover:text-dark hover:shadow-md rounded-xl group"
        >
          <Menu className="w-6 h-6 text-mid-gray group-hover:text-dark" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {effectiveNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => {
              if (typeof item.onClick === "function") item.onClick();
            }}
            className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl text-[15px] font-medium
        focus:outline-none
        ${collapsed
          ?"px-3 py-2.5"
          :"px-4 py-2.5"
        }
         ${
           isActive
             ? "bg-white/20 text-dark shadow-md border border-white/50 "
             : " text-mid-gray hover:bg-white/30 hover:text-dark hover:shadow-md"
         }`
      }
          >

            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-2">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center space-x-2 p-2 text-dark hover:bg-white/30 hover:text-dark hover:shadow-md rounded-xl group text-sm"
        >
          <LogOut className="w-4 h-4 group-hover:text-dark" />
          {!collapsed && (
            <span className="group-hover:text-dark">
              {logoutLabel}
            </span>
          )}
        </button>

      </div>
        <Popup
          title="Confirm"
          content="Are you sure you want to logout. This action cannot be undone."
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          variant="confirm"
        />
    </div>
  );
};

export default Sidebar;
