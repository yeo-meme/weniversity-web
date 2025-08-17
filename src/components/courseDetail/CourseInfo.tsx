import React, { useCallback, useMemo } from "react";
import type { CourseDetailInfo } from "../../types/courseDetail/courseDetail";
import ShareIcon from "../../assets/icon-Share.png";

interface CourseInfoProps {
  courseDetail: CourseDetailInfo;
  formatDateRange: (dateStr: string) => string;
  onShare: () => void;
  onEnrollment: (title: string) => void;
  error: string | null;
}

const CourseInfo: React.FC<CourseInfoProps> = ({
  courseDetail,
  formatDateRange,
  onShare,
  onEnrollment,
  error,
}) => {
  const courseInfoData = useMemo(
    () => [
      {
        label: "교육 유형",
        value: courseDetail.type === "vod" ? "일반" : "부스트 커뮤니티",
      },
      {
        label: "주제",
        value: `${courseDetail.category} 개발`,
      },
      {
        label: "난이도",
        value: courseDetail.level,
      },
      {
        label: "커리큘럼",
        value: `${courseDetail.chapters.length}개 수업`,
      },
      {
        label: "소요 시간",
        value: `${courseDetail.chapters.length} 시간`,
      },
      {
        label: "수강 기간",
        value: "6개월",
      },
    ],
    [courseDetail]
  );

  const tags = useMemo(
    () => [
      {
        text: courseDetail.type === "vod" ? "일반" : "부스트 커뮤니티",
        className: "p-2 bg-gray-700 text-white rounded-md text-xs",
      },
      {
        text: courseDetail.category,
        className: "p-2 bg-blue-100 text-blue-700 rounded-md text-xs",
      },
      {
        text: courseDetail.level,
        className: "p-2 bg-green-100 text-green-700 rounded-md text-xs",
      },
    ],
    [courseDetail]
  );

  const formatPrice = useCallback((price: number | undefined) => {
    if (price === undefined) return "정보 없음";
    if (price === 0) return "무료 강의";
    if (price === -1) return "국비 지원 강의";
    if (price > 0) return `₩ ${price.toLocaleString()}`;
    return "";
  }, []);

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
          <div>
            {/* 강의 태그 정보 */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span key={index} className={tag.className}>
                    {tag.text}
                  </span>
                ))}
              </div>
            </div>

            {/* 강의 제목 및 설명 */}
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              {courseDetail.title}
            </h3>

            <p className="text-gray-600 mb-6">{courseDetail.description}</p>

            {/* 강사 정보 */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                <img
                  src={courseDetail.instructors[0].profile_image}
                  alt="강사"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {courseDetail.instructors[0].name}
                </p>
                <p className="text-sm text-gray-600">
                  {courseDetail.instructors[0].affiliation}
                </p>
              </div>
            </div>

            {/* 교육 일정 */}
            <div className="p-8 bg-gray-100 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">교육 일정</h4>
              <div className="text-sm space-y-1">
                <p>
                  <strong className="text-gray-400 mr-4">모집 기간</strong>
                  {formatDateRange(courseDetail.course_duedate)}
                </p>
                <p>
                  <strong className="text-gray-400 mr-4">교육 기간</strong>
                  {`${formatDateRange(
                    courseDetail.course_time
                  )} | 5일, 총 30시간 | 10:00 ~ 17:00`}
                </p>
              </div>
            </div>
          </div>

          {/* 강의 정보 카드 */}
          <div>
            <div className="sticky top-4">
              <h3 className="font-bold mb-4">강의 정보</h3>
              <div className="text-center mb-6">
                <div className="mt-8 py-4 border-t border-b border-gray-300 text-sm space-y-3">
                  {courseInfoData.map((info, index) => (
                    <div key={index} className="flex">
                      <span className="text-left w-28 mr-3 text-gray-600">
                        {info.label}
                      </span>
                      <span className="font-medium">{info.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center mb-6">
                <div className="text-left text-2xl font-bold text-gray-900">
                  {formatPrice(courseDetail.price)}
                </div>
              </div>

              <button
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-3 disabled:opacity-50"
                onClick={() => onEnrollment(courseDetail.title)}
              >
                수강신청 하기
              </button>

              <button
                className="flex justify-center items-center w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                onClick={onShare}
              >
                <img src={ShareIcon} alt="" className="mr-2" />
                공유하기
              </button>

              {error && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CourseInfo);
