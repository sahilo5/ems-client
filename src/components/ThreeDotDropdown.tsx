import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

type DropdownOption = {
  label: string;
  href?: string; // optional now
  target?: "_self" | "_blank" | "_parent" | "_top";
  onClick?: () => void; // new support
};

type ThreeDotDropdownProps = {
  options?: DropdownOption[];
};

const ThreeDotDropdown: React.FC<ThreeDotDropdownProps> = ({ options = [] }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-200 rounded-full group"
      >
        <svg
          className="w-5 h-5 text-dark group-hover:text-dark"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 7a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-light border border-gray-200 rounded-md shadow-lg z-50">
          <ul className="py-1">
            {options.map(({ label, href, target = "_self", onClick }, index) => (
              <li key={index}>
                {onClick ? (
                  <button
                    onClick={() => {
                      onClick();
                      setIsOpen(false);
                    }}
                    className="w-full text-left block px-4 py-2 text-sm text-secondary hover:bg-white"
                  >
                    {label}
                  </button>
                ) : href?.startsWith("/") ? (
                  <Link
                    to={href}
                    target={target}
                    className="block px-4 py-2 text-sm text-secondary hover:bg-white"
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </Link>
                ) : (
                  <a
                    href={href}
                    target={target}
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm text-secondary hover:bg-white"
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ThreeDotDropdown;
