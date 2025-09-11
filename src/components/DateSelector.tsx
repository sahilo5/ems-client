import React, { useState } from "react";
import Label from "./Label";
import dayjs from "dayjs";

type DateSelectorProps = {
  label?: string;
  value: string[]; // selected dates in ["YYYY-MM-DD", ...] format
  onChange: (dates: string[]) => void;
};

const DateSelector: React.FC<DateSelectorProps> = ({ label, value, onChange }) => {
  const [inputDate, setInputDate] = useState("");

  const handleAddDate = () => {
    if (!inputDate) return;
    const formatted = dayjs(inputDate).format("YYYY-MM-DD");
    if (!value.includes(formatted)) {
      onChange([...value, formatted]);
    }
    setInputDate("");
  };

  const handleRemoveDate = (date: string) => {
    onChange(value.filter((d) => d !== date));
  };

  return (
    <div className="flex flex-col space-y-2">
      {label && <Label text={label} status="Required" />}

      {/* Date Picker Input */}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={inputDate}
          onChange={(e) => setInputDate(e.target.value)}
          className="border border-secondary rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="button"
          onClick={handleAddDate}
          className="px-3 py-2 bg-primary text-white text-sm rounded-md"
        >
          Add
        </button>
      </div>

      {/* Selected Dates List */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((date) => (
            <span
              key={date}
              className="px-3 py-1 text-gray-200 bg-primary rounded-md text-sm flex items-center gap-2"
            >
              {date}
              <button
                type="button"
                onClick={() => handleRemoveDate(date)}
                className=" text-2 text-gray-200 hover:text-white"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default DateSelector;
