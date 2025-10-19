import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "tertiary"| "safe"| "refresh";
  disabled?: boolean;
  className?: string;
  title?: string;  
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
      variantClass = "bg-primary text-light cursor-pointer hover:shadow-md font-bold";
      break;
    case "secondary":
      variantClass = "bg-white/50 border shadow-sm border-white backdrop-blur-sm text-dark hover:bg-white/40 text-Black cursor-pointer hover:shadow-lg font-bold";
      break;
    case "tertiary":
      variantClass = "bg-accent text-light cursor-pointer hover:shadow-md font-bold";
      break;
    case "safe":
      variantClass =
        "bg-green-300 border border-green-400 text-dark hover:bg-green-300 cursor-pointer hover:shadow-lg font-bold";
      break;
    case "danger":
      variantClass =
        "bg-red-500/50 border border-red-600 text-dark hover:bg-red-400/70 cursor-pointer hover:shadow-lg font-bold";
      break;
    case "refresh":
      variantClass =
        "bg-orange-300/70 border border-orange-300 text-dark hover:bg-orange-300/90 cursor-pointer hover:shadow-lg font-bold";
      break;

    default:
      variantClass = "bg-primary/50 border shadow-sm border-primary backdrop-blur-sm text-dark hover:bg-primary/40 text-Black cursor-pointer hover:shadow-lg hover:border-2 font-bold";
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
