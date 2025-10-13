import React, { useState, useEffect } from "react";
import Label from "./Label";

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
      onChange(`${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`);
    } else {
      onChange("");
    }
  }, [hours, minutes]);

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      {label && <Label text={label} status="Required" />}
      <div className="flex gap-2">
        <input
          type="number"
          min="0"
          max="23"
          placeholder="HH"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          disabled={disabled}
          className={`px-3 py-2 text-sm rounded-md border bg-white/30 backdrop-blur-sm text-dark text-center
            focus:outline-none
            ${error
              ? "border-red-500 focus:ring-2 focus:ring-red-500"
              : "border-white focus:ring-2 focus:ring-black/10"}
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        />
        <span className="flex items-center font-bold">:</span>
        <input
          type="number"
          min="0"
          max="59"
          placeholder="MM"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          disabled={disabled}
          className={`px-3 py-2 text-sm rounded-md border bg-white/30 backdrop-blur-sm text-dark text-center
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
