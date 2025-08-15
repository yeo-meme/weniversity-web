import React, { useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import {
  fetchBoostCourses,
  resetHomeCoursesState,
} from "../../store/homeCourseSlice";
import { setActiveFilter, clearAllFilters } from "../../store/courseSlice";
import CourseCard from "../course/CourseCard";
import CourseCardSkeleton from "../course/CourseCardSkeleton";
import RightIcon from "../../assets/icon-right.png";

const SKELETON_COUNT = 3;
const BOOST_COMMUNITY_FILTER = "부스트 커뮤니티";

const BoostList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { boostCourses, boostLoading, boostError } = useAppSelector(
    state => state.homeCourse
  );

  // 더보기 버튼 클릭 핸들러
  const handleMoreClick = useCallback(() => {
    dispatch(clearAllFilters());
    dispatch(
      setActiveFilter({
        filterType: "types",
        value: BOOST_COMMUNITY_FILTER,
      })
    );
    navigate("/courses");
  }, [dispatch, navigate]);

  // 스켈레톤 배열
  const skeletonArray = useMemo(
    () =>
      Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <CourseCardSkeleton key={`skeleton-${index}`} />
      )),
    []
  );

  // 강의 카드 목록
  const courseCards = useMemo(
    () =>
      boostCourses.map(course => (
        <CourseCard key={course.course_id} course={course} />
      )),
    [boostCourses]
  );

  // 빈 상태
  const isEmpty = useMemo(
    () => !boostLoading && boostCourses.length === 0 && !boostError,
    [boostLoading, boostCourses.length, boostError]
  );

  // 데이터 fetch
  useEffect(() => {
    dispatch(fetchBoostCourses());
  }, [dispatch]);

  // 클린업
  useEffect(() => {
    return () => {
      dispatch(resetHomeCoursesState());
    };
  }, [dispatch]);

  return (
    <section className="w-full">
      <div className="my-8 mx-4">
        {/* 헤더 섹션 */}
        <header className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-semibold text-gray-900">
            부스트 커뮤니티에서 소통하며 학습
          </h3>
          <button
            onClick={handleMoreClick}
            className="flex items-center text-gray-400 hover:text-blue-600 font-medium text-sm transition-colors duration-200"
            aria-label="부스트 커뮤니티 강의 더보기"
          >
            더보기
            <img
              src={RightIcon}
              alt=""
              className="ml-1 w-4 h-4"
              loading="lazy"
            />
          </button>
        </header>

        {/* 에러 상태 */}
        {boostError && (
          <div
            className="bg-red-50 border border-red-200 rounded-md p-4 mb-6"
            role="alert"
            aria-live="polite"
          >
            <p className="text-sm text-red-600">{boostError}</p>
          </div>
        )}

        {/* 강의 카드 */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          role="list"
          aria-label="부스트 커뮤니티 강의 목록"
        >
          {boostLoading ? skeletonArray : courseCards}
        </div>

        {/* 빈 상태 */}
        {isEmpty && (
          <div
            className="flex flex-col items-center justify-center text-center py-12"
            role="status"
            aria-live="polite"
          >
            <p className="text-gray-500">부스트 커뮤니티 강의가 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(BoostList);
