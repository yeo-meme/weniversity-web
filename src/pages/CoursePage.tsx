import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  fetchCourses,
  setActiveFilter,
  clearAllFilters,
  resetCourseState,
} from "../store/courseSlice";
import CourseCard from "../components/course/CourseCard";
import FilterButton from "../components/course/FilterButton";

const CoursePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filteredCourses, filters, activeFilters, loading, error } =
    useAppSelector(state => state.course);

  useEffect(() => {
    dispatch(fetchCourses());
    return () => {
      dispatch(resetCourseState());
    };
  }, [dispatch]);

  const handleFilterChange = (
    filterType: keyof typeof activeFilters,
    value: string
  ) => {
    dispatch(setActiveFilter({ filterType, value }));
  };

  const handleClearFilters = () => {
    dispatch(clearAllFilters());
  };

  const hasActiveFilters = () => {
    return (
      !activeFilters.categories.includes("전체") ||
      activeFilters.subjects.length > 0 ||
      activeFilters.levels.length > 0 ||
      activeFilters.formats.length > 0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900">
            강의를 불러오는 중...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 페이지 제목 */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
            어떤 강의를 찾으시나요?
          </h2>
        </div>

        {/* 필터 섹션 */}
        <div className="border-y-2 border-gray-200">
          {/* 주제 필터 */}
          <div className="flex items-center p-5 border-b border-gray-200">
            <h3 className="font-bold text-gray-700 mr-5 w-20">주제</h3>
            <div className="flex flex-wrap gap-2 overflow-x-auto custom-scrollbar">
              {filters.categories.map(category => (
                <FilterButton
                  key={category}
                  label={category}
                  value={category}
                  isActive={activeFilters.categories.includes(category)}
                  onClick={value => handleFilterChange("categories", value)}
                />
              ))}
            </div>
          </div>

          {/* 유형 필터 */}
          <div className="flex items-center p-5 border-b border-gray-200">
            <h3 className="font-bold text-gray-700 mr-5 w-20">유형</h3>
            <div className="flex flex-wrap gap-2 overflow-x-auto custom-scrollbar">
              {filters.subjects.map(subject => (
                <FilterButton
                  key={subject}
                  label={subject}
                  value={subject}
                  isActive={activeFilters.subjects.includes(subject)}
                  onClick={value => handleFilterChange("subjects", value)}
                />
              ))}
            </div>
          </div>

          {/* 난이도 필터 */}
          <div className="flex items-center p-5 border-b border-gray-200">
            <h3 className="font-bold text-gray-700 mr-5 w-20">난이도</h3>
            <div className="flex flex-wrap gap-2 overflow-x-auto custom-scrollbar">
              {filters.levels.map(level => (
                <FilterButton
                  key={level}
                  label={level}
                  value={level}
                  isActive={activeFilters.levels.includes(level)}
                  onClick={value => handleFilterChange("levels", value)}
                />
              ))}
            </div>
          </div>

          {/* 가격 필터 */}
          <div className="flex items-center p-5 border-b border-gray-200">
            <h3 className="font-bold text-gray-700 mr-5 w-20">가격</h3>
            <div className="flex flex-wrap gap-2">
              {filters.formats.map(format => (
                <FilterButton
                  key={format}
                  label={format}
                  value={format}
                  isActive={activeFilters.formats.includes(format)}
                  onClick={value => handleFilterChange("formats", value)}
                />
              ))}
            </div>
          </div>

          {/* 필터 컨트롤 버튼들 */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            {hasActiveFilters() && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                필터 초기화
              </button>
            )}
          </div>
        </div>

        {/* 선택된 필터 표시 */}
        {hasActiveFilters() && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {/* 카테고리 필터 */}
              {!activeFilters.categories.includes("전체") &&
                activeFilters.categories.map(category => (
                  <span
                    key={`category-${category}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    주제: {category}
                    <button
                      onClick={() => handleFilterChange("categories", category)}
                      className="ml-2 hover:text-blue-600"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </span>
                ))}

              {/* 기타 필터들 */}
              {activeFilters.subjects.map(subject => (
                <span
                  key={`subject-${subject}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                >
                  유형: {subject}
                  <button
                    onClick={() => handleFilterChange("subjects", subject)}
                    className="ml-2 hover:text-green-600"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 코스 목록 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              강의 목록 ({filteredCourses.length}개)
            </h2>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">조건에 맞는 강의가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
