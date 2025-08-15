import React from "react";

interface LectureFilterProps {
  label: string;
  value: string;
  isActive: boolean;
  onClick: (value: string) => void;
}

const LectureFilter: React.FC<LectureFilterProps> = ({
  label,
  value,
  isActive,
  onClick,
}) => {
  const handleClick = () => {
    onClick(value);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center min-w-[70px] px-3 transition-colors ${
        isActive
          ? "text-primary font-bold"
          : " text-gray500 hover:text-blue-600"
      }`}
    >
      {label}
    </button>
  );
};

export default LectureFilter;
