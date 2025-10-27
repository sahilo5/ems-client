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
    <header className="w-full h-12 flex items-center justify-between px-2 relative">
      {/* Logo / Title */}
      <div
  className="text-xl sm:text-2xl font-bold truncate 
             bg-gradient-to-r from-white/90 via-blue-300/80 to-white
             text-transparent bg-clip-text 
             transition-all duration-700 
             cursor-none
             hover:scale-101 hover:from-white-200/90 hover:to-white/90">
  {companyName}
</div>

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
          className="flex items-center space-x-1 cursor-pointer backdrop:blur-lg p-2 mt-2 bg-white/40 rounded-full border-white/30 border-1 hover:bg-white/60 "
          onClick={onUserClick}
        >
          <UserCircle2 className="w-6 h-6 text-dark" />
          {/* Hide username on mobile, show on sm+ */}
          <span className="hidden sm:inline text-md  text-dark">
            {userName}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
