import React, { useState } from "react";

interface FindPasswordInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string | null;
  showError?: boolean;
}

const FindPasswordInput: React.FC<FindPasswordInputProps> = ({
  id,
  value,
  onChange,
  onBlur,
  errorMessage,
  showError = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur(e);
  };
  return (
    <div>
      <label
        htmlFor={id}
        className={`block text-sm font-medium transition-colors ${
          isFocused ? "text-blue-500" : "text-gray-700"
        }`}
      >
        이메일
      </label>
      <div className="mt-1">
        <input
          id={id}
          name={id}
          type="email"
          value={value}
          placeholder="이메일을 입력하세요."
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={true}
          className="w-full
    border-0
    border-b-2
    border-gray-300
    focus:outline-none
    focus:ring-0
    focus:border-blue-500
    placeholder-gray-400
    text-gray-900
    text-lg
    py-1.5"
        />
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

export default FindPasswordInput;
