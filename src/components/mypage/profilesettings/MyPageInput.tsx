import React, { useState, useCallback } from "react";

interface MyPageInputProps {
  id: string;
  label: string;
  type: "text" | "date";
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
  errorMessage?: string;
  showError?: boolean;
}

const MyPageInput: React.FC<MyPageInputProps> = React.memo(
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
      <div className="w-[257px]">
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
            className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`}
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

export default React.memo(MyPageInput);
