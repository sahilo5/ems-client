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
      className={`${collapsed ? "w-15" : "w-50"
        } h-full bg-primary text-white shadow-lg flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-light">
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-1 hover:bg-gray-200 rounded-md group"
        >
          <Menu className="w-6 h-6 text-light group-hover:text-dark" />
        </button>
        {!collapsed && (
          <div className="text-xl font-bold whitespace-nowrap">EMS</div>
        )}
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
              `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition ${isActive ? "bg-secondary text-white" : "text-light"
              }`
            }
          >

            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-2 border-t border-light">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center space-x-2 p-2 hover:bg-gray-200 rounded-md group text-sm"
        >
          <LogOut className="w-4 h-4 text-light group-hover:text-dark" />
          {!collapsed && (
            <span className="text-light group-hover:text-dark">
              {logoutLabel}
            </span>
          )}
        </button>

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
    </div>
  );
};

export default Sidebar;
