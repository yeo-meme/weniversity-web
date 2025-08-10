import React from "react";
import type { CourseInstructor } from "../../types/courseDetail";

interface InstructorSectionProps {
  instructor: CourseInstructor;
}

const InstructorSection: React.FC<InstructorSectionProps> = ({
  instructor,
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-6">
        <h3 className="text-4xl font-bold mb-3">강사소개</h3>
        <p className="text-blue-600 font-medium mb-10">"{instructor.bio}"</p>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
        <div className="w-60 h-60 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={instructor.profileImage}
            alt="강사"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <p className="mb-6 flex items-center text-2xl font-bold text-gray-900">
            {instructor.name}{" "}
            <span className="ml-2 text-base text-gray-400 font-normal">
              {instructor.englishName}
            </span>
          </p>

          <div className="mb-6 space-y-2 text-gray-700">
            {instructor.currentPositions.map((position, index) => (
              <p key={index}>
                <span className="mr-2 text-blue-600">現</span> {position}
              </p>
            ))}
            {instructor.previousPositions.map((position, index) => (
              <p key={index}>
                <span className="mr-2 text-gray-500">前</span> {position}
              </p>
            ))}
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p className="mb-2 text-base text-gray-900 font-bold">
              [강사 이력]
            </p>
            {instructor.education.map((edu, index) => (
              <p key={index}>{edu}</p>
            ))}
            {instructor.achievements.map((achievement, index) => (
              <p key={index}>{achievement}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSection;
