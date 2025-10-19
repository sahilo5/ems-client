import React from "react";
import Label from "./Label";

type InputProps = {
  type?: "text" | "email" | "password" | "date" | "month" | "number";
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  hasError?: boolean; // 👈 NEW
};

const Input: React.FC<InputProps> = ({
  type = "text",
  label,
  placeholder = "",
  value,
  onChange,
  disabled = false,
  className = "",
  hasError = false,
}) => {
  const getAutoComplete = () => {
    switch (type) {
      case "email":
        return "email";
      case "password":
        return "current-password";
      case "text":
        return "on";
      default:
        return undefined;
    }
  };

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      {label && <Label text={label} status="Required" />}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        autoComplete={getAutoComplete()}
        className={`
          px-3 py-2 text-sm rounded-md border bg-white/30 backdrop-blur-sm shadow-md text-dark
          focus:outline-none
          ${hasError ? "border-red-500 focus:ring-2 focus:ring-red-500" : "border-white focus:ring-2 focus:ring-black/10"}
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      />
    </div>
  );
};

export default Input;
