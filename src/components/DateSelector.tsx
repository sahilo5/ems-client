import React, { useState } from "react";
import Label from "./Label";
import dayjs from "dayjs";
import Toggle from "./Toggle";

type DateSelectorProps = {
  label?: string;
  value: string[];
  onChange: (dates: string[]) => void;
};

const DateSelector: React.FC<DateSelectorProps> = ({
  label,
  value,
  onChange,
}) => {
  const [selectionMode, setSelectionMode] = useState<"individual" | "range">(
    "individual"
  );
  const [inputDate, setInputDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleAddDate = () => {
    if (selectionMode === "individual") {
      if (!inputDate) return;
      const formatted = dayjs(inputDate).format("YYYY-MM-DD");
      if (!value.includes(formatted)) {
        onChange([...value, formatted].sort());
      }
      setInputDate("");
    } else {
      if (!startDate || !endDate) return;

      const start = dayjs(startDate);
      const end = dayjs(endDate);

      if (start.isAfter(end)) {
        return;
      }

      let current = start;
      const datesToAdd: string[] = [];
      while (current.isBefore(end) || current.isSame(end)) {
        const formatted = current.format("YYYY-MM-DD");
        if (!value.includes(formatted)) {
          datesToAdd.push(formatted);
        }
        current = current.add(1, "day");
      }
      onChange([...value, ...datesToAdd].sort());
      setStartDate("");
      setEndDate("");
    }
  };

  const handleRemoveDate = (date: string) => {
    onChange(value.filter((d) => d !== date));
  };

  return (
    <div className="flex flex-col space-y-2">
      {label && <Label text={label} status="Required" />}

      <div className="flex items-center gap-2">
        <span>Renge Mode :</span>
        <Toggle
          checked={selectionMode === "range"}
          onChange={(checked) =>
            setSelectionMode(checked ? "range" : "individual")
          }
        />
        
      </div>

      {selectionMode === "individual" ? (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
            className="border border-white bg-white/30 backdrop-blur-sm rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <button
            type="button"
            onClick={handleAddDate}
            className="px-3 py-2 bg-primary text-white text-sm rounded-md"
          >
            Add
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-white bg-white/30 backdrop-blur-sm rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <span>to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-white bg-white/30 backdrop-blur-sm rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <button
            type="button"
            onClick={handleAddDate}
            className="px-3 py-2 bg-primary text-white text-sm rounded-md"
          >
            Add
          </button>
        </div>
      )}

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
