import React, { useEffect, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  fetchCourses,
  setActiveFilter,
  clearAllFilters,
  resetCourseState,
  setCurrentPage,
} from "../store/courseSlice";
import type { CourseFilters } from "../types/course";
import FilterSection from "../components/course/FilterSection";
import CourseList from "../components/course/CourseList";
import FilterControls from "../components/course/FilterControls";

const CoursePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { courses, filters, activeFilters, pagination, loading, error } =
    useAppSelector(state => state.course);

  // 메모이제이션된 courses 배열
  const coursesToDisplay = useMemo(() => {
    return Array.isArray(courses) ? courses : [];
  }, [courses]);

  // API 호출을 위한 파라미터 메모이제이션
  const fetchParams = useMemo(
    () => ({
      page: pagination.currentPage,
      categories: activeFilters.categories,
      types: activeFilters.types,
      levels: activeFilters.levels,
      prices: activeFilters.prices,
    }),
    [
      pagination.currentPage,
      activeFilters.categories,
      activeFilters.types,
      activeFilters.levels,
      activeFilters.prices,
    ]
  );

  // 코스 데이터 가져오기
  useEffect(() => {
    dispatch(fetchCourses(fetchParams));
  }, [dispatch, fetchParams]);

  // 컴포넌트 언마운트 시 상태 초기화
  useEffect(() => {
    return () => {
      dispatch(resetCourseState());
    };
  }, [dispatch]);

  // 필터 변경 핸들러
  const handleFilterChange = useCallback(
    (filterType: keyof CourseFilters, value: string) => {
      dispatch(setActiveFilter({ filterType, value }));
    },
    [dispatch]
  );

  // 필터 초기화 핸들러
  const handleClearFilters = useCallback(() => {
    dispatch(clearAllFilters());
  }, [dispatch]);

  // 페이지 변경 핸들러
  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(setCurrentPage(page));
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [dispatch]
  );

  // 초기 로딩 상태
  if (loading && pagination.currentPage === 1) {
    return <div>로딩중..</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 페이지 제목 */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
            어떤 강의를 찾으시나요?
          </h1>
        </header>

        {/* 필터 섹션 */}
        <FilterSection
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
        />

        {/* 필터 컨트롤 */}
        <FilterControls
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* 코스 목록 */}
        <CourseList
          courses={coursesToDisplay}
          pagination={pagination}
          loading={loading}
          error={error}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default CoursePage;
