import React, { useState } from "react";
import type { Course } from "../../types/course/course";
import HeartIconHover from "../../assets/icon-heart-hover.png";
import HeartIcon from "../../assets/icon-heart.png";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const getLike = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log(`${id} 강의를 선택했습니다.`);
  };

  const navigateToCourseDetail = (id: string) => {
    navigate(`/courses/${id}`);
  };

  const getPriceLabel = (price?: number) => {
    if (price === undefined) return "정보없음";
    if (price === -1) return "국비지원";
    if (price === 0) return "무료";
    if (price > 0) return "유료";
    return "정보없음";
  };

  const getTypeLabel = (type: string) => {
    if (type === "vod") return "일반";
    if (type === "boost") return "부스트 커뮤니티";
  };

  return (
    <div className="rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 course-card cursor-pointer">
      <div
        className="relative bg-python-gradient rounded-t-lg overflow-hidden"
        onClick={() => navigateToCourseDetail(course.course_id)}
      >
        {/* 강의 이미지 */}
        <img src={course.course_image} alt="강의이미지" />

        {/* 좋아요 이미지 */}
        <img
          src={isHovered ? HeartIconHover : HeartIcon}
          alt="좋아요"
          className="absolute top-4 right-4 transition-colors"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={event => getLike(course.course_id, event)}
        />
      </div>

      {/* 코스 정보 */}
      <div className="p-4">
        {/* 태그들 */}
        <div className="flex gap-2 mb-3">
          <span className="px-3 py-1 rounded-md text-xs font-medium bg-gray-700 text-white">
            {getTypeLabel(course.type)}
          </span>
          <span className="px-3 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700">
            {course.category}
          </span>
          <span className="px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
            {course.level}
          </span>
          <span className="px-3 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-700">
            {getPriceLabel(course.price)}
          </span>
        </div>

        {/* 코스 제목 */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>

        {/* 강사 정보 */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src={course.instructors?.[0]?.profile_image}
              alt="강사"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center">
            <p className="text-sm font-medium text-gray-900">
              {course.instructors[0].name}
            </p>
            <p className="ml-2 text-xs text-gray-500">
              {course.instructors[0].affiliation}
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
