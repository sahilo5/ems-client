import React from "react";

type BadgeProps = {
  text: string;
  variant?: "success" | "danger" | "warning" | "info" | "neutral";
  className?: string;
};

const variantStyles: Record<Required<BadgeProps>["variant"], string> = {
  success: "bg-green-100 text-green-700 border-1 border-green-500",
  danger: "bg-red-100 text-red-700 border-1 border-red-500",
  warning: "bg-yellow-100 text-yellow-700 border-1 border-yellow-500",
  info: "bg-blue-100 text-blue-700 border-1 border-blue-500",
  neutral: "bg-gray-100 text-gray-700 border-1 border-gray-500",
};

const Badge: React.FC<BadgeProps> = ({
  text,
  variant = "neutral",
  className = "",
}) => {
  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium rounded-full ${variantStyles[variant]} ${className}`}
    >
      {text}
    </span>
  );
};

export default Badge;
