import React, { useEffect } from "react";
import ReactDOM from "react-dom";

type MiniWindowProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "default" | "small"; // new prop
};

const sizeStyles: Record<NonNullable<MiniWindowProps["size"]>, string> = {
  default: "w-[70%] max-h-[90vh]",
  small: "w-full max-w-md max-h-[90vh]",
};

const MiniWindow: React.FC<MiniWindowProps> = ({
  isOpen,
  onClose,
  children,
  size = "default",
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
      onClick={onClose}
    >
      <div
        className={`relative bg-white p-6 rounded-xl shadow-lg overflow-y-auto ${sizeStyles[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default MiniWindow;
