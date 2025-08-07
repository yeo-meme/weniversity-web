import React, { useState } from "react";
import type { Course } from "../../types/course";
// import HeartIconPicked from "../../assets/icon-heart-picked.png";
import HeartIconHover from "../../assets/icon-heart-hover.png";
import HeartIcon from "../../assets/icon-heart.png";
import LectureImage from "../../assets/lecture-img.png";

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [isHovered, setIsHovered] = useState(false);
  const getLike = (id: string) => {
    console.log(`${id} 강의를 선택했습니다.`);
  };

  return (
    <div className="rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 course-card cursor-pointer">
      {/* 코스 이미지 */}
      <div className="relative bg-python-gradient rounded-t-lg overflow-hidden">
        {/* 강의 이미지 */}
        <img src={LectureImage} alt="강의이미지" />

        <img
          src={isHovered ? HeartIconHover : HeartIcon}
          alt="좋아요"
          className="absolute top-4 right-4 transition-colors"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => getLike(course.id)}
        />
      </div>

      {/* 코스 정보 */}
      <div className="p-4">
        {/* 태그들 */}
        <div className="flex gap-2 mb-3">
          {course.tags.map((tag, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-md text-xs font-medium ${
                index === 0
                  ? "bg-gray-700 text-white"
                  : index === 1
                  ? "bg-blue-100 text-blue-600"
                  : index === 2
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
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
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src={course.image}
              alt="강사"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center">
            <p className="text-sm font-medium text-gray-900">
              {course.instructor}
            </p>
            <p className="ml-2 text-xs text-gray-500">
              {course.instructorRole}
            </p>
          </div>
        </div>

        {/* 코스 설명 */}
        <p className="text-sm text-gray-900 line-clamp-2">
          {course.description}
        </p>
      </div>
    </div>
  );
};

export default CourseCard;
