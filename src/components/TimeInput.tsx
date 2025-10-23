import React, { useState, useEffect } from "react";
import Label from "./Label";
import { useToast } from "./ToastProvider";

type TimeInputProps = {
  label?: string;
  value: string; // "HH:mm"
  onChange: (val: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
};

const TimeInput: React.FC<TimeInputProps> = ({
  label,
  value,
  onChange,
  error,
  disabled = false,
  className = "",
}) => {
  const { showToast } = useToast();
  const [hours, setHours] = useState(value.split(":")[0] || "");
  const [minutes, setMinutes] = useState(value.split(":")[1] || "");

  // 🔄 Sync local state with parent value
  useEffect(() => {
    const [h, m] = value ? value.split(":") : ["", ""];
    setHours(h || "");
    setMinutes(m || "");
  }, [value]);

  // 🔄 Update parent whenever hours or minutes change
  useEffect(() => {
    if (hours !== "" && minutes !== "") {
      onChange(`${hours}:${minutes}`);
    } else {
      onChange("");
    }
  }, [hours, minutes]);

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      {label && <Label text={label} status="Required" />}
      <div className="flex flex-col 2xl:flex-row gap-3">
        <input
          type="text"
          maxLength={2}
          placeholder="HH"
          value={hours}
          onChange={(e) => {
            const val = e.target.value;
            if (!/^\d{0,2}$/.test(val)) {
              showToast("Hours must be 0-2 digits only", "error");
              return;
            }
            const num = parseInt(val, 10);
            if (val.length === 2 && (isNaN(num) || num > 23)) {
              showToast("Hours must be between 00 and 23", "error");
              return;
            }
            setHours(val);
          }}
          disabled={disabled}
          className={`flex-1 px-3 py-2 text-sm rounded-md border bg-white/30 backdrop-blur-sm text-dark text-center
            focus:outline-none
            ${error
              ? "border-red-500 focus:ring-2 focus:ring-red-500"
              : "border-white focus:ring-2 focus:ring-black/10"}
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        />
        <span className="flex items-center font-bold">:</span>
        <input
          type="text"
          maxLength={2}
          placeholder="MM"
          value={minutes}
          onChange={(e) => {
            const val = e.target.value;
            if (!/^\d{0,2}$/.test(val)) {
              showToast("Minutes must be 0-2 digits only", "error");
              return;
            }
            const num = parseInt(val, 10);
            if (val.length === 2 && (isNaN(num) || num > 59)) {
              showToast("Minutes must be between 00 and 59", "error");
              return;
            }
            setMinutes(val);
          }}
          disabled={disabled}
          className={`px-3 py-2 text-sm rounded-md border bg-white /30 backdrop-blur-sm text-dark text-center
        focus:outline-none
        ${error
          ? "border-red-500 focus:ring-2 focus:ring-red-500"
          : "border-white focus:ring-2 focus:ring-black/10"}
        disabled:opacity-50 disabled:cursor-not-allowed
          `}
        />
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default TimeInput;
