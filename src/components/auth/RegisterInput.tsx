import React from "react";

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
}

const RegisterInput: React.FC<RegisterInputProps> = ({
  id,
  label,
  type,
  value,
  placeholder,
  onChange,
  onBlur,
  className = "",
  required = true,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
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
          onBlur={onBlur}
          required={required}
          className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`}
        />
      </div>
    </div>
  );
};

export default RegisterInput;
