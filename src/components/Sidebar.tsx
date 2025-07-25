import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react"; // You can customize these icons

export type NavItem = {
  label: string;
  path: string;
  icon?: React.ReactNode;
};

type SidebarProps = {
  navItems: NavItem[];
  logoutLabel?: string;
  logoutIcon?: React.ReactNode;
};

const Sidebar: React.FC<SidebarProps> = ({
  navItems,
  logoutLabel = "Logout",
  logoutIcon = <LogOut className="w-4 h-4" />,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div
      className={`${
        collapsed ? "w-16" : "w-64"
      } h-full bg-primary text-white shadow-lg flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-light">
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
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition ${
                isActive ? "bg-secondary text-white" : "text-light"
              }`
            }
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-light">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-2 text-light hover:text-white text-sm"
        >
          {logoutIcon}
          {!collapsed && <span>{logoutLabel}</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
