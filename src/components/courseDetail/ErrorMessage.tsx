import React from "react";

interface ErrorMessageProps {
  message?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = "오류가 발생했습니다.",
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg font-medium text-gray-900">{message}</div>
      </div>
    </div>
  );
};

export default React.memo(ErrorMessage);
