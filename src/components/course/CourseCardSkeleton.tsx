import React, { memo } from "react";

const CourseCardSkeleton: React.FC = memo(() => {
  return (
    <div className="rounded-lg shadow-sm border border-gray-200 animate-pulse">
      {/* 이미지 영역 skeleton */}
      <div className="relative bg-gray-200 rounded-t-lg overflow-hidden h-48">
        <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
        {/* 하트 아이콘 skeleton */}
        <div className="absolute top-4 right-4 w-7 h-7 bg-gray-300 rounded"></div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="p-4">
        {/* 태그들 skeleton */}
        <div className="flex gap-2 mb-3">
          <div className="h-6 w-12 bg-gray-300 rounded-md"></div>
          <div className="h-6 w-16 bg-gray-300 rounded-md"></div>
          <div className="h-6 w-10 bg-gray-300 rounded-md"></div>
          <div className="h-6 w-12 bg-gray-300 rounded-md"></div>
        </div>

        {/* 제목 skeleton */}
        <div className="mb-2">
          <div className="h-7 bg-gray-300 rounded mb-1"></div>
        </div>

        {/* 강사 정보 skeleton */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="flex items-center">
            <div className="h-5 bg-gray-300 rounded w-24"></div>
            <div className="h-4 bg-gray-300 rounded w-20 ml-2"></div>
          </div>
        </div>

        {/* 설명 skeleton */}
        <div>
          <div className="h-5 bg-gray-300 rounded mb-1"></div>
          <div className="h-5 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
});

CourseCardSkeleton.displayName = "CourseCardSkeleton";

export default CourseCardSkeleton;
