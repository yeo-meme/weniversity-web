import React from "react";
import ExamImage from "../../assets/exam.png";

const CourseHeader: React.FC = () => {
  return (
    <div>
      <img src={ExamImage} alt="Course Banner" />
    </div>
  );
};

export default React.memo(CourseHeader);
