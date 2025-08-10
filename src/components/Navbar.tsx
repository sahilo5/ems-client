import React, { useEffect, useRef, useState } from "react";
import { Bell, UserCircle2 } from "lucide-react";

type NavbarProps = {
  companyName?: string;
  userName: string;
  notifications?: string[];
  onUserClick?: () => void;
  onNotificationClick?: () => void;
};

const Navbar: React.FC<NavbarProps> = ({
  companyName = "Company Name",
  userName,
  notifications,
  onUserClick,
  onNotificationClick,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (onNotificationClick) onNotificationClick();
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full h-14 flex items-center justify-between px-4 bg-accent shadow border-l border-light relative">
      {/* Logo / Title */}
      <div className="text-2xl font-bold text-light">{companyName}</div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        {notifications && notifications.length > 0 && (
          <div className="relative" ref={notificationRef}>
            <button
              className="relative text-dark hover:text-primary"
              onClick={toggleNotifications}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded border border-light z-10">
                <ul className="text-sm max-h-60 overflow-y-auto">
                  {notifications.map((note, idx) => (
                    <li
                      key={idx}
                      className="px-4 py-2 hover:bg-light text-dark cursor-pointer"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* User Info */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={onUserClick}
        >
          <UserCircle2 className="w-6 h-6 text-light" />
          <span className="text-md text-light">{userName}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
