import React, { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  fetchCourses,
  setActiveFilter,
  clearAllFilters,
  resetCourseState,
  setCurrentPage,
} from "../store/courseSlice";
import CourseCard from "../components/course/CourseCard";
import FilterButton from "../components/course/FilterButton";
import Pagination from "../components/common/Pagination";
import ResetIcon from "../assets/icon-reset.png";
import DeleteIcon from "../assets/icon-X.png";
import EmptyIcon from "../assets/icon-empty.png";

const CoursePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    filteredCourses,
    filters,
    activeFilters,
    pagination,
    loading,
    error,
  } = useAppSelector(state => state.course);

  useEffect(() => {
    dispatch(
      fetchCourses({
        page: pagination.currentPage,
        categories: activeFilters.categories,
        types: activeFilters.types,
        levels: activeFilters.levels,
        prices: activeFilters.prices,
      })
    );
  }, [dispatch, activeFilters, pagination.currentPage]);

  useEffect(() => {
    return () => {
      dispatch(resetCourseState());
    };
  }, [dispatch]);

  const paginatedCourses = useMemo(() => {
    return Array.isArray(filteredCourses) ? filteredCourses : [];
  }, [filteredCourses]);

  const handleFilterChange = (
    filterType: keyof typeof activeFilters,
    value: string
  ) => {
    dispatch(setActiveFilter({ filterType, value }));
  };

  const handleClearFilters = () => {
    dispatch(clearAllFilters());
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters = () => {
    return (
      !activeFilters.categories.includes("전체") ||
      activeFilters.types.length > 0 ||
      activeFilters.levels.length > 0 ||
      activeFilters.prices.length > 0
    );
  };

  if (loading && pagination.currentPage === 1) {
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
              {filters.types.map(type => (
                <FilterButton
                  key={type}
                  label={type}
                  value={type}
                  isActive={activeFilters.types.includes(type)}
                  onClick={value => handleFilterChange("types", value)}
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
              {filters.prices.map(price => (
                <FilterButton
                  key={price}
                  label={price}
                  value={price}
                  isActive={activeFilters.prices.includes(price)}
                  onClick={value => handleFilterChange("prices", value)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 필터 컨트롤 버튼들 */}
        <div className="flex items-center mt-8">
          {hasActiveFilters() && (
            <button
              onClick={handleClearFilters}
              className="border rounded-lg px-4 py-3 flex text-sm hover:text-blue-500"
            >
              <img src={ResetIcon} alt="" className="mr-2" />
              필터 초기화
            </button>
          )}

          {/* 선택된 필터 표시 */}
          {hasActiveFilters() && (
            <div className="ml-6">
              <div className="flex flex-wrap gap-2">
                {/* 카테고리 필터 */}
                {!activeFilters.categories.includes("전체") &&
                  activeFilters.categories.map(category => (
                    <span
                      key={`category-${category}`}
                      className="inline-flex items-center text-sm rounded-md px-3 py-1 bg-slate-700 text-white"
                    >
                      {category}
                      <button
                        onClick={() =>
                          handleFilterChange("categories", category)
                        }
                        className="ml-2 hover:text-blue-600"
                      >
                        <img src={DeleteIcon} alt="" />
                      </button>
                    </span>
                  ))}

                {/* 유형 필터 */}
                {activeFilters.types.map(type => (
                  <span
                    key={`type-${type}`}
                    className="inline-flex items-center text-sm rounded-md px-3 py-1 bg-slate-700 text-white"
                  >
                    {type}
                    <button
                      onClick={() => handleFilterChange("types", type)}
                      className="ml-2 hover:text-blue-600"
                    >
                      <img src={DeleteIcon} alt="" />
                    </button>
                  </span>
                ))}

                {/* 난이도 필터 */}
                {activeFilters.levels.map(level => (
                  <span
                    key={`level-${level}`}
                    className="inline-flex items-center text-sm rounded-md px-3 py-1 bg-slate-700 text-white"
                  >
                    {level}
                    <button
                      onClick={() => handleFilterChange("levels", level)}
                      className="ml-2 hover:text-blue-600"
                    >
                      <img src={DeleteIcon} alt="" />
                    </button>
                  </span>
                ))}

                {/* 가격 필터 */}
                {activeFilters.prices.map(price => (
                  <span
                    key={`price-${price}`}
                    className="inline-flex items-center text-sm rounded-md px-3 py-1 bg-slate-700 text-white"
                  >
                    {price}
                    <button
                      onClick={() => handleFilterChange("prices", price)}
                      className="ml-2 hover:text-blue-600"
                    >
                      <img src={DeleteIcon} alt="" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 코스 목록 */}
        <div className="my-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              강의 목록 ({pagination.totalItems}개)
            </h3>
            {loading && pagination.currentPage > 1 && (
              <div className="text-sm text-gray-500">로딩 중...</div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {!Array.isArray(filteredCourses) || filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <img src={EmptyIcon} alt="" />
              <p className="mt-6 text-gray-500">찾는 조건의 강의가 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {paginatedCourses.map(course => (
                  <CourseCard key={course.course_id} course={course} />
                ))}
              </div>

              {/* 페이지네이션 */}
              <Pagination
                currentPage={pagination.currentPage}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
