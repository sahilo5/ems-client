import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "tertiary";
  disabled?: boolean;
  className?: string;
  title?: string; // ✅ Add this line
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  title, 
}) => {
  let variantClass = "";

  switch (variant) {
    case "primary":
      variantClass = "bg-primary hover:opacity-90 text-white cursor-pointer";
      break;
    case "secondary":
      variantClass = "bg-light text-dark border border-secondary hover:bg-gray-200 cursor-pointer";
      break;
    case "tertiary":
      variantClass = "bg-accent hover:opacity-90 cursor-pointer text-white";
      break;
    case "danger":
      variantClass = "bg-red-600 hover:bg-red-700 cursor-pointer text-white";
      break;
    default:
      variantClass = "bg-primary hover:opacity-90 cursor-pointer text-white";
  }

  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title} 
      className={`px-4 py-2 rounded-md font-medium text-sm transition duration-200 ${variantClass} ${disabledClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
