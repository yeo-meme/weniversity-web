import React, { memo } from "react";
import Pagination from "../common/Pagination";
import EmptyIcon from "../../assets/icon-empty.png";
import type { MyLecture } from "../../types/myLectures/myLectures";
import CourseCardSkeleton from "../course/CourseCardSkeleton";
import MyLectureCard from "./MyLectureCard";

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

interface LectureListProps {
  lectures: MyLecture[];
  loading: boolean;
  error: string | null;
  pagination?: PaginationState;
  onLearnClick: (lectureId: string) => void;
  onDetailClick: (lectureId: string) => void;
  onReapplyClick: (lectureId: string) => void;
  onPageChange?: (page: number) => void;
}

const EmptyState = memo(() => (
  <div className="flex flex-col items-center justify-center text-center py-12">
    <img src={EmptyIcon} alt="강의 없음" className="w-16 h-16 mb-4" />
    <p className="text-gray-500">조건에 맞는 강의가 없습니다.</p>
  </div>
));

EmptyState.displayName = "EmptyState";

const ErrorState = memo<{ error: string }>(({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
    <p className="text-sm text-red-600">{error}</p>
  </div>
));

ErrorState.displayName = "ErrorState";

const LectureGrid = memo<{
  lectures: MyLecture[];
  loading: boolean;
  onLearnClick: (lectureId: string) => void;
  onDetailClick: (lectureId: string) => void;
  onReapplyClick: (lectureId: string) => void;
}>(({ lectures, loading, onLearnClick, onDetailClick, onReapplyClick }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    {loading
      ? Array.from({ length: 6 }, (_, index) => (
          <CourseCardSkeleton key={`skeleton-${index}`} />
        ))
      : lectures.map((lecture, index) => (
          <MyLectureCard
            key={lecture.course.course_id || `lecture-${index}`}
            lecture={lecture}
            onLearnClick={() =>
              onLearnClick(lecture.course.course_id.toString())
            }
            onDetailClick={() =>
              onDetailClick(lecture.course.course_id.toString())
            }
            onReapplyClick={() =>
              onReapplyClick(lecture.course.course_id.toString())
            }
          />
        ))}
  </div>
));

LectureGrid.displayName = "LectureGrid";

const LectureList: React.FC<LectureListProps> = memo(
  ({
    lectures,
    loading,
    error,
    pagination,
    onLearnClick,
    onDetailClick,
    onReapplyClick,
    onPageChange,
  }) => {
    return (
      <div className="my-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            내 강의 목록 ({pagination?.totalItems || lectures.length}개)
          </h3>
        </div>

        {error && <ErrorState error={error} />}

        {lectures.length === 0 && !loading ? (
          <EmptyState />
        ) : (
          <>
            <LectureGrid
              lectures={lectures}
              loading={loading}
              onLearnClick={onLearnClick}
              onDetailClick={onDetailClick}
              onReapplyClick={onReapplyClick}
            />

            {pagination &&
              onPageChange &&
              pagination.totalItems > pagination.itemsPerPage && (
                <Pagination
                  currentPage={pagination.currentPage}
                  totalItems={pagination.totalItems}
                  itemsPerPage={pagination.itemsPerPage}
                  onPageChange={onPageChange}
                />
              )}
          </>
        )}
      </div>
    );
  }
);

LectureList.displayName = "LectureList";

export default LectureList;
