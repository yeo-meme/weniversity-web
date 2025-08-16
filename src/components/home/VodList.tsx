import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hook";
import {
  fetchVodCourses,
  resetHomeCoursesState,
} from "../../store/homeCourseSlice";
import { setActiveFilter, clearAllFilters } from "../../store/courseSlice";
import CourseCard from "../course/CourseCard";
import CourseCardSkeleton from "../course/CourseCardSkeleton";
import RightIcon from "../../assets/icon-right.png";

const VodList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { vodCourses, vodLoading, vodError } = useAppSelector(
    state => state.homeCourse
  );

  const SKELETON_COUNT = 6;
  const BOOST_COMMUNITY_FILTER = "VOD";

  // 더보기 버튼 클릭 핸들러
  const handleMoreClick = useCallback(() => {
    // 필터 초기화 후 VOD 필터 설정
    dispatch(clearAllFilters());
    dispatch(
      setActiveFilter({
        filterType: "types",
        value: BOOST_COMMUNITY_FILTER,
      })
    );
    navigate("/courses");
  }, [dispatch, navigate]);

  // 컴포넌트 마운트 시 VOD 강의 데이터 가져오기
  useEffect(() => {
    dispatch(fetchVodCourses());
  }, [dispatch]);

  // 컴포넌트 언마운트 시 상태 초기화
  useEffect(() => {
    return () => {
      dispatch(resetHomeCoursesState());
    };
  }, [dispatch]);

  return (
    <section className="w-full">
      <div className="my-8 mx-4">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-semibold text-gray-900">
            온라인 VOD 강의로 자유롭게 학습
          </h3>
          <button
            onClick={handleMoreClick}
            className="flex items-center text-gray-400 hover:text-blue-600 font-medium text-sm transition-colors duration-200"
          >
            더보기
            <img src={RightIcon} alt="" className="ml-1 w-4 h-4" />
          </button>
        </div>

        {/* 에러 상태 */}
        {vodError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-sm text-red-600">{vodError}</p>
          </div>
        )}

        {/* 강의 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {vodLoading
            ? // 로딩 중일 때 스켈레톤 6개 표시
              Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                <CourseCardSkeleton key={`skeleton-${index}`} />
              ))
            : // 실제 데이터 표시
              vodCourses.map(course => (
                <CourseCard key={course.course_id} course={course} />
              ))}
        </div>

        {/* 빈 상태 */}
        {!vodLoading && vodCourses.length === 0 && !vodError && (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <p className="text-gray-500">VOD 강의가 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(VodList);
