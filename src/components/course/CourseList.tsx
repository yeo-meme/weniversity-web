import React, { memo } from "react";
import CourseCard from "./CourseCard";
import Pagination from "../common/Pagination";
import EmptyIcon from "../../assets/icon-empty.png";
import type { Course, PaginationState } from "../../types/course/course";
import CourseCardSkeleton from "./CourseCardSkeleton";

interface CourseListProps {
  courses: Course[];
  pagination: PaginationState;
  loading: boolean;
  error: string | null;
  onPageChange: (page: number) => void;
}

const EmptyState = memo(() => (
  <div className="flex flex-col items-center justify-center text-center py-12">
    <img src={EmptyIcon} alt="검색 결과 없음" />
    <p className="mt-6 text-gray-500">찾는 조건의 강의가 없습니다.</p>
  </div>
));

EmptyState.displayName = "EmptyState";

const ErrorState = memo<{ error: string }>(({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
    <p className="text-sm text-red-600">{error}</p>
  </div>
));

ErrorState.displayName = "ErrorState";

const CourseGrid = memo<{ courses: Course[]; loading: boolean }>(
  ({ courses, loading }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {loading
        ? Array.from({ length: courses.length || 9 }).map((_, index) => (
            <CourseCardSkeleton key={`skeleton-${index}`} />
          ))
        : courses.map((course: Course) => (
            <CourseCard key={course.course_id} course={course} />
          ))}
    </div>
  )
);
CourseGrid.displayName = "CourseGrid";

const CourseList: React.FC<CourseListProps> = memo(
  ({ courses, pagination, loading, error, onPageChange }) => {
    return (
      <div className="my-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            강의 목록 ({pagination.totalItems}개)
          </h3>
        </div>

        {error && <ErrorState error={error} />}

        {courses.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <CourseGrid courses={courses} loading={loading} />
            <Pagination
              currentPage={pagination.currentPage}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={onPageChange}
            />
          </>
        )}
      </div>
    );
  }
);

CourseList.displayName = "CourseList";

export default CourseList;
