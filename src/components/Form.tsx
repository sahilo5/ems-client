import React from "react";
import Input from "./Input";
import Checkbox from "./Checkbox";
import Dropdown from "./Dropdown";
import Button from "./Button";

// Supported input types
type InputFieldType = "text" | "email" | "password" | "date" | "month" | "number";

// Define all allowed field types
export type FormField =
  | {
      type: InputFieldType;
      name: string;
      label?: string;
      placeholder?: string;
      value: string;
      onChange: (value: string) => void;
      disabled?: boolean;
      error?: string;
    }
  | {
      type: "checkbox";
      name: string;
      label?: string;
      checked: boolean;
      onChange: (value: boolean) => void;
      disabled?: boolean;
      error?: string;
    }
  | {
      type: "dropdown";
      name: string;
      label?: string;
      value: string;
      onChange: (value: string) => void;
      options: { label: string; value: string }[];
      disabled?: boolean;
      error?: string;
    }
  | {
      group: true;
      fields: FormField[];
    };

type FormProps = {
  fields: FormField[];
  onSubmit?: () => void;
  submitLabel?: string;
  disabled?: boolean;
  className?: string;
};

const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  submitLabel,
  disabled = false,
  className = "",
}) => {
  const renderField = (field: FormField, idx: number): React.ReactNode => {
    // Check if it's a grouped row
    if ("group" in field && field.group) {
      return (
        <div 
          key={idx} 
          className="flex flex-col md:flex-row gap-4 w-full"
        >
          {field.fields.map((subField, subIdx) => (
            <div key={subIdx} className="w-full">
              {renderField(subField, subIdx)}
            </div>
          ))}
        </div>
      );
    }
    
  
    // Common wrapper to show error below input
    const commonWrapper = (inputElement: React.ReactNode) => (
      <div className="space-y-1">
        {inputElement}
        {"error" in field && field.error?.trim() && (
  <p className="text-sm text-red-500">{field.error}</p>
)}

      </div>
    );
  
    // Now safe to use field.type since it's not a group
    if ("type" in field && field.type === "checkbox") {
      return commonWrapper(
        <Checkbox
          label={field.label}
          checked={field.checked}
          onChange={field.onChange}
          disabled={field.disabled}
          className={field.error }
        />
      );
    }
  
    if ("type" in field && field.type === "dropdown") {
      return commonWrapper(
        <Dropdown
          label={field.label}
          value={field.value}
          onChange={field.onChange}
          options={field.options}
          disabled={field.disabled}
          className={field.error }
        />
      );
    }
  
    // All other input types
    if ("type" in field) {
      return commonWrapper(
        <Input
          type={field.type}
          label={field.label}
          value={field.value}
          placeholder={field.placeholder}
          onChange={field.onChange}
          disabled={field.disabled}
          hasError={!!field.error}
        />
      );
    }
  };
  
  const content = (
    <div className={`space-y-4 ${className}`}>
      {fields.map((field, idx) => (
        <div key={idx}>{renderField(field, idx)}</div>
      ))}

      {submitLabel && onSubmit && (
        <Button type="submit" disabled={disabled}>
          {submitLabel}
        </Button>
      )}
    </div>
  );

  return onSubmit ? (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {content}
    </form>
  ) : (
    content
  );
};

export default Form;
