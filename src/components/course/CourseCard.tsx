import React from "react";
import type { Course } from "../../types/course";

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 course-card cursor-pointer">
      {/* 코스 이미지 */}
      <div className="relative h-48 bg-python-gradient rounded-t-lg overflow-hidden">
        {/* 배경 장식 요소들 */}
        <div className="absolute inset-0">
          {/* 기하학적 패턴들 */}
          <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white/20 rounded-lg rotate-12"></div>
          <div className="absolute top-8 right-8 w-12 h-12 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-8 right-4 w-8 h-8 bg-white/15 transform rotate-45"></div>

          {/* AI 아이콘 (오른쪽 중간) */}
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
            <div className="w-12 h-8 bg-white/20 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
          </div>
        </div>

        {/* Python 메인 텍스트 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-white text-center">
            <div className="text-2xl font-bold mb-1">PYTHON</div>
            <div className="text-sm opacity-90">Boost Community 1st</div>
          </div>
        </div>

        {/* 디스코드 로고 */}
        <div className="absolute bottom-4 left-4">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <svg
              className="w-6 h-6 text-blue-600"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.191.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </div>
        </div>

        {/* 하트와 돋보기 버튼 */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="w-8 h-8 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/35 transition-colors group">
            <svg
              className="w-4 h-4 text-white group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <button className="w-8 h-8 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/35 transition-colors group">
            <svg
              className="w-4 h-4 text-white group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
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
