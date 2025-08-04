import React, { useState } from "react";
import DownIcon from "../../assets/icon-down.png";

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
  errorMessage?: string;
  showError?: boolean;
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
  errorMessage,
  showError = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };
  return (
    <div>
      <label
        htmlFor={id}
        className={`block text-sm font-medium transition-colors ${
          isFocused ? "text-blue-500" : "text-gray-700"
        }`}
      >
        {label}
      </label>
      <div className="mt-1 relative">
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          required={required}
          className={`appearance-none
            w-full
    border-0
    border-b-2
    border-gray-300
    focus:outline-none
    focus:ring-0
    focus:border-blue-500
    text-gray-900
    text-lg
    py-1.5 ${className}`}
        >
          <option value="">{placeholder}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
          <img src={DownIcon} alt="화살표" className="w-4 h-4" />
        </div>
      </div>

      {/* 에러 메시지 */}
      {showError && errorMessage && (
        <div className="mt-1 bg-red-50 border border-red-200 rounded-md p-2">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default RegisterSelect;
