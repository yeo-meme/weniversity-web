import React, { memo } from "react";

interface LectureFilterProps {
  label: string;
  value: string;
  isActive: boolean;
  onClick: (value: string) => void;
}

const MyLectureFilter: React.FC<LectureFilterProps> = memo(
  ({ label, value, isActive, onClick }) => {
    const handleClick = () => {
      onClick(value);
    };

    return (
      <button
        onClick={handleClick}
        className={`px-3 py-1.5 text-base cursor-pointer transition-colors ${
          isActive
            ? "text-blue-500 font-bold"
            : "text-black hover:text-blue-600"
        }`}
      >
        {label}
      </button>
    );
  }
);

MyLectureFilter.displayName = "MyLectureFilter";

export default MyLectureFilter;
