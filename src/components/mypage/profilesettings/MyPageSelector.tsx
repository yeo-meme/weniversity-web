import React from "react";
import DownIcon from "../../../assets/icon-down.png";

interface Option {
  value: string;
  label: string;
}

interface MyPageSelectProps {
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

const MyPageSelect: React.FC<MyPageSelectProps> = ({
  id,
  label,
  value,
  options,
  placeholder = "선택",
  onChange,
  onBlur,
  className = "",
  required = false,
  errorMessage,
  showError = false,
}) => {
  return (
    <div className="w-[257px]">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative">
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`}
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

export default MyPageSelect;
