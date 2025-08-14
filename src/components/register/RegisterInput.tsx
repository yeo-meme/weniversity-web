import React, { useState, useCallback } from "react";

interface RegisterInputProps {
  id: string;
  label: string;
  type: "text" | "email" | "password" | "date";
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
  errorMessage?: string;
  showError?: boolean;
}

const RegisterInput: React.FC<RegisterInputProps> = React.memo(
  ({
    id,
    label,
    type,
    value,
    placeholder,
    onChange,
    onBlur,
    className = "",
    required = false,
    errorMessage,
    showError = false,
  }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = useCallback(() => {
      setIsFocused(true);
    }, []);

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        onBlur(e);
      },
      [onBlur]
    );

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
        <div className="mt-1">
          <input
            id={id}
            name={id}
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            required={required}
            className={`w-full border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-gray-400 text-gray-900 text-lg py-1.5 ${className}`}
          />
        </div>

        {showError && errorMessage && (
          <div className="mt-1 bg-red-50 border border-red-200 rounded-md p-2">
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        )}
      </div>
    );
  }
);

export default React.memo(RegisterInput);
