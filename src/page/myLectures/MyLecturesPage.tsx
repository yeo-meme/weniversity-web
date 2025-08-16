import React, { useEffect, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hook";
import {
  fetchMyLectures,
  setActiveFilter,
  clearAllFilters,
  resetMyLectureState,
  setCurrentPage,
} from "../../store/myLecturesSlice";
import MyLectureFilter from "../../components/myLectures/MyLectureFilter";
import MyLectureList from "../../components/myLectures/MyLectureList";
import { useNavigate } from "react-router-dom";

const MyLecturesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { myLectures, loading, error, activeFilters, pagination } =
    useAppSelector(state => state.myLecture);

  // 필터 옵션
  const statusOptions = ["전체", "학습 가능", "종료"] as const;
  const subjectOptions = ["전체", "VOD", "부스트 커뮤니티"] as const;

  // API 호출을 위한 파라미터
  const fetchParams = useMemo(
    () => ({
      page: pagination.currentPage,
      types: activeFilters.types,
      statuses: activeFilters.statuses,
    }),
    [pagination.currentPage, activeFilters.types, activeFilters.statuses]
  );

  // 내 강의 데이터 가져오기
  useEffect(() => {
    dispatch(fetchMyLectures(fetchParams));
  }, [dispatch, fetchParams]);

  // 컴포넌트 언마운트 시 상태 초기화
  useEffect(() => {
    return () => {
      dispatch(resetMyLectureState());
    };
  }, [dispatch]);

  // 필터 변경 핸들러
  const handleSubjectFilterChange = useCallback(
    (value: string) => {
      dispatch(setActiveFilter({ filterType: "types", value }));
    },
    [dispatch]
  );

  const handleStatusFilterChange = useCallback(
    (value: string) => {
      dispatch(setActiveFilter({ filterType: "statuses", value }));
    },
    [dispatch]
  );

  // 페이지 변경 핸들러
  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(setCurrentPage(page));
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [dispatch]
  );

  // 필터 초기화 핸들러
  const handleClearFilters = useCallback(() => {
    dispatch(clearAllFilters());
  }, [dispatch]);

  // 강의 액션 핸들러
  const handleLearnClick = useCallback((lectureId: string) => {
    console.log("학습하기:", lectureId);
    // 실제 학습 페이지로 이동하는 로직 추가
  }, []);

  const handleDetailClick = useCallback(
    (lectureId: string) => {
      navigate(`/courses/${lectureId}`);
    },
    [navigate]
  );

  const handleReapplyClick = useCallback((lectureId: string) => {
    console.log("재수강:", lectureId);
    // 재수강 신청 로직
    // navigate(`/course/${lectureId}/enroll`);
  }, []);

  // 활성 필터 확인
  const hasActiveFilters = useMemo(() => {
    return activeFilters.types.length > 0 || activeFilters.statuses.length > 0;
  }, [activeFilters]);

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 페이지 제목 */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
            내 강의 목록
          </h1>
        </header>

        {/* 필터 섹션 */}
        <div className="border-y-2 border-gray-200 mb-8">
          {/* 상태 필터 */}
          <div className="flex items-center p-5 border-b border-gray-200">
            <h3 className="font-bold text-gray-700 mr-5 w-20">상태</h3>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(status => (
                <MyLectureFilter
                  key={status}
                  label={status}
                  value={status}
                  isActive={
                    status === "전체"
                      ? activeFilters.statuses.length === 0
                      : activeFilters.statuses.includes(
                          status === "학습 가능"
                            ? "active"
                            : status === "종료"
                            ? "dropped"
                            : status
                        )
                  }
                  onClick={handleStatusFilterChange}
                />
              ))}
            </div>
          </div>

          {/* 유형 필터 */}
          <div className="flex items-center p-5">
            <h3 className="font-bold text-gray-700 mr-5 w-20">유형</h3>
            <div className="flex flex-wrap gap-2">
              {subjectOptions.map(subject => (
                <MyLectureFilter
                  key={subject}
                  label={subject}
                  value={subject}
                  isActive={
                    subject === "전체"
                      ? activeFilters.types.length === 0
                      : activeFilters.types.includes(
                          subject === "VOD"
                            ? "vod"
                            : subject === "부스트 커뮤니티"
                            ? "boost"
                            : subject
                        )
                  }
                  onClick={handleSubjectFilterChange}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 필터 초기화 버튼 */}
        {hasActiveFilters && (
          <div className="mb-4">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              필터 초기화
            </button>
          </div>
        )}

        {/* 강의 목록 */}
        <MyLectureList
          lectures={myLectures}
          loading={loading}
          error={error}
          onLearnClick={handleLearnClick}
          onDetailClick={handleDetailClick}
          onReapplyClick={handleReapplyClick}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default MyLecturesPage;
