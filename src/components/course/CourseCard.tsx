import React from "react";
import type { Course } from "../../types/course";
import HeartIcon from "../../assets/icon-heart.png";

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-blue-300 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 course-card cursor-pointer">
      {/* 코스 이미지 */}
      <div className="bg-green-300 relative h-48 bg-python-gradient rounded-t-lg overflow-hidden">
        {/* 강의 이미지 */}
        <img src="" alt="" />
        <img
          src={HeartIcon}
          alt=""
          className="absolute top-4 right-4 hover:bg-white/35 transition-colors"
        />
      </div>

      {/* 코스 정보 */}
      <div className="p-4">
        {/* 태그들 */}
        <div className="flex gap-2 mb-3">
          {course.tags.map((tag, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                index === 0
                  ? "bg-gray-800 text-white"
                  : index === 1
                  ? "bg-blue-100 text-blue-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 코스 제목 */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>

        {/* 강사 정보 */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-600">강</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {course.instructor}
            </p>
            <p className="text-xs text-gray-500">{course.instructorRole}</p>
          </div>
        </div>

        {/* 코스 설명 */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {course.description}
        </p>
      </div>
    </div>
  );
};

export default CourseCard;
