import React from "react";

interface Option {
  value: string;
  label: string;
}

interface RegisterSelectProps {
  id: string;
  label: string;
  value: string;
  options: Option[];
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
  className?: string;
  required?: boolean;
}

const RegisterSelect: React.FC<RegisterSelectProps> = ({
  id,
  label,
  value,
  options,
  placeholder = "선택하세요",
  onChange,
  onBlur,
  className = "",
  required = false,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          className={`block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`}
        >
          <option value="">{placeholder}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default RegisterSelect;
