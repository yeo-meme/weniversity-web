import React, { useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hook";
import {
  resetSearchState,
  searchCourses,
  setCurrentPage,
  setSearchQuery,
} from "../../store/searchSlice";
import CourseCardSkeleton from "../../components/course/CourseCardSkeleton";
import CourseCard from "../../components/course/CourseCard";
import Pagination from "../../components/common/Pagination";
import EmptyIcon from "../../assets/icon-empty.png";

const SearchPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { courses, searchQuery, pagination, loading, error } = useAppSelector(
    state => state.search
  );
  const SKELETON_COUNT = 9;

  // URL에서 검색어 추출
  const queryFromUrl = searchParams.get("q") || "";

  // 검색 결과 표시용 courses 배열
  const coursesToDisplay = useMemo(() => {
    return Array.isArray(courses) ? courses : [];
  }, [courses]);

  // 검색 파라미터
  const searchParams_memo = useMemo(
    () => ({
      title: queryFromUrl,
      page: pagination.currentPage,
    }),
    [queryFromUrl, pagination.currentPage]
  );

  // URL에서 검색어가 변경되었을 때 상태 업데이트 및 검색 실행
  useEffect(() => {
    if (queryFromUrl && queryFromUrl !== searchQuery) {
      dispatch(setSearchQuery(queryFromUrl));
      dispatch(setCurrentPage(1)); // 새로운 검색 시 페이지를 1로 리셋
    }
  }, [queryFromUrl, searchQuery, dispatch]);

  // 검색 실행
  useEffect(() => {
    if (queryFromUrl) {
      dispatch(searchCourses(searchParams_memo));
    } else {
      navigate("/");
    }
  }, [dispatch, searchParams_memo, queryFromUrl, navigate]);

  // 컴포넌트 언마운트 시 상태 초기화
  useEffect(() => {
    return () => {
      dispatch(resetSearchState());
    };
  }, [dispatch]);

  // 페이지 변경 핸들러
  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(setCurrentPage(page));
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [dispatch]
  );

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 검색 결과 */}
        <div className="flex items-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mr-3">
            {queryFromUrl}
          </h2>
          <span className="text-xl text-gray-400 font-bold">
            검색결과: {pagination.totalItems}건
          </span>
        </div>

        {/* 에러 상태 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* 메인 콘텐츠 */}
        <div className="my-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                <CourseCardSkeleton key={`skeleton-${index}`} />
              ))}
            </div>
          ) : coursesToDisplay.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <img src={EmptyIcon} alt="검색 결과 없음" className="mb-6" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                "{queryFromUrl}"에 대한 검색 결과가 없습니다.
              </h3>
              <p className="text-gray-500">다른 키워드로 검색해보세요.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {coursesToDisplay.map(course => (
                  <CourseCard key={course.course_id} course={course} />
                ))}
              </div>
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

export default SearchPage;
