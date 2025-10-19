import React from "react";
import Label from "./Label";
import { Listbox } from "@headlessui/react";

type Option = {
  label: string;
  value: string;
};

type DropdownProps = {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
  disabled = false,
  className = "",
}) => {
  const selected = options.find((opt) => opt.value === value);

  return (
    <div className={`relative flex flex-col space-y-1 ${className}`}>
      {label && <Label text={label} status="Required" />}

      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          {/* Trigger Button */}
          <Listbox.Button
            className={`
              relative w-full cursor-pointer rounded-md border border-white/40 
              bg-white/30 px-3 py-2 pr-10 text-left text-sm text-dark shadow 
              backdrop-blur-sm transition-all
              focus:outline-none focus:ring-2 focus:ring-black/10
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <span>{selected ? selected.label : "Select an Option"}</span>

            {/* Chevron Icon */}
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="w-4 h-4 text-dark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </Listbox.Button>

          {/* Dropdown Options */}
          {!disabled && (
            <Listbox.Options
              className="
                absolute z-10 mt-1 w-full overflow-auto rounded-md border border-white/40 
                bg-white/40 text-dark shadow-lg backdrop-blur-md focus:outline-none
                max-h-60 
              "
            >
              {options.map((opt) => (
                <Listbox.Option
                  key={opt.value}
                  value={opt.value}
                  className={({ active, selected }) =>
                    `
                    cursor-pointer select-none px-3 py-2 text-sm rounded backdrop-blur-md gap-1 hover:bg-primary hover:text-light
                    ${active
                      ? "bg-white/60 "
                      : "bg-white/40 "
                    }
                    ${selected ? "font-semibold" : "font-normal"}
                    `
                  }
                >
                  {opt.label}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          )}
        </div>
      </Listbox>
    </div>
  );
};

export default Dropdown;
