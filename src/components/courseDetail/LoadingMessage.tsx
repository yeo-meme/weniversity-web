import React from "react";

interface LoadingMessageProps {
  message?: string;
}

const LoadingMessage: React.FC<LoadingMessageProps> = ({
  message = "로딩 중...",
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg font-medium text-gray-900">{message}</div>
      </div>
    </div>
  );
};

export default React.memo(LoadingMessage);
