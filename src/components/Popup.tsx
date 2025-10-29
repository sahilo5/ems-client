import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type PopupProps = {
  title: string;
  content?: string | React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "confirm" | "notify" | "error";
};

const Popup: React.FC<PopupProps> = ({
  title,
  content,
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "confirm",
}) => {
  if (!isOpen) return null;

  const getVariantColors = () => {
    switch (variant) {
      case "error":
        return {
          bg: "bg-red-100",
          title: "text-red-800",
          button: "bg-red-600 hover:bg-red-700 text-white",
        };
      case "notify":
      default:
        return {
          bg: "bg-[color:var(--color-light)]",
          title: "text-[color:var(--color-primary)]",
          button:
            "bg-primary/50 border shadow-sm border-primary backdrop-blur-sm text-dark hover:bg-primary/40 text-Black cursor-pointer hover:shadow-lg hover:border-2 font-bold",
        };
    }
  };

  const variantClasses = getVariantColors();

  const popupContent = (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div
        className={`w-[90%] max-w-md rounded-2xl backdrop-blur-sm bg-white/75 text-dark shadow-inner shadow-white/50 border-white border-1 p-6 ${variantClasses.bg} transition`}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4 ">
          <h2 className={`text-lg font-semibold ${variantClasses.title}`}>
            {title}
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-800" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6 text-sm text-gray-700">{content}</div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-none border rounded-md shadow-sm bg-white/10 border-white backdrop-blur-sm text-black hover:bg-white/40 text-Black cursor-pointer hover:shadow-lg hover:border-2"
            >
              {cancelLabel}
            </button>
          )}
          {onConfirm && (
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-sm rounded-md ${variantClasses.button}`}
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // ✅ Render popup outside sidebar
  return createPortal(popupContent, document.body);
};

export default Popup;
