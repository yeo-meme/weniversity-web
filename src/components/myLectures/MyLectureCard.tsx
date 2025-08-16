import React, { memo } from "react";
import { VideoIcon } from "../common/icon";
import type { MyLecture } from "../../types/myLectures/myLectures";

interface LectureCardProps {
  lecture: MyLecture;
  onLearnClick: () => void;
  onDetailClick: () => void;
  onReapplyClick: () => void;
}

const MyLectureCard: React.FC<LectureCardProps> = memo(
  ({ lecture, onLearnClick, onDetailClick, onReapplyClick }) => {
    const {
      course,
      isExpired = false,
      progress,
      status,
      type,
      // tags
    } = lecture;
    const imageSource = course.course_image || "/default-lecture-thumbnail.png";
    const progressPercentage = parseFloat(progress) || 0;
    const currentProgress = Math.floor((progressPercentage / 100) * 15);
    const totalLessons = 15;

    const getStatusInfo = () => {
      switch (status) {
        case "dropped":
          return {
            isDisabled: false,
            showReapply: true,
            statusText: "수강 기간이 종료되었습니다.",
          };
        case "active":
        default:
          return {
            isDisabled: false,
            showReapply: false,
            statusText: null,
          };
      }
    };

    const statusInfo = getStatusInfo();

    return (
      <article className="lecture-card w-full max-w-[380px] flex flex-col rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="thumbnail-wrapper relative w-full h-[200px]">
          <img
            src={imageSource}
            className="thumbnail-img w-full h-full object-cover"
            alt={`${course.title} 강의 썸네일`}
            onError={e => {
              // 이미지 로드 실패 시 기본 이미지로 대체
              const target = e.target as HTMLImageElement;
              target.src = "/default-lecture-thumbnail.png";
            }}
          />
          {(isExpired || statusInfo.statusText) && (
            <div className="end-overlay absolute top-0 left-0 flex items-center justify-center w-full h-full text-white bg-black/70 text-base font-medium text-center px-4">
              {statusInfo.statusText || "수강 기간이 종료되었습니다."}
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="tag-wrap flex gap-2 mb-3 flex-wrap">
            {/* tags는 api data 수정 필요 */}
            {/* tags  */}
            {/* {tags &&
              tags.map((tag, index) => (
                <span
                  key={`tag-${index}-${tag.text}`}
                  className={`tag px-3 py-1.5 rounded-md text-sm font-semibold ${
                    tag.type === "type"
                      ? "tag-type text-white bg-[#47494d]"
                      : "tag-kind text-[#2e6ff2] bg-[#dee8ff]"
                  }`}
                >
                  {tag.text}
                </span>
              ))} */}

            {/* 강의 타입 표시 */}
            <span
              key={`type-${type}`}
              className="tag px-3 py-1.5 rounded-md text-sm font-semibold text-white bg-[#47494d]"
            >
              {type === "vod" ? "VOD" : "부스트 커뮤니티"}
            </span>

            {/* 상태 표시 */}
            <span
              key={`status-${status}`}
              className={`tag px-3 py-1.5 rounded-md text-sm font-semibold ${
                status === "active"
                  ? "text-green-700 bg-green-100"
                  : status === "completed"
                  ? "text-blue-700 bg-blue-100"
                  : "text-gray-700 bg-gray-100"
              }`}
            >
              {status === "active"
                ? "학습중"
                : status === "completed"
                ? "완료"
                : "종료"}
            </span>
          </div>

          <h3 className="lecture-title text-lg font-semibold mb-4 h-14 overflow-hidden leading-6">
            <span className="line-clamp-2">{course.title}</span>
          </h3>

          {/* 진행률 정보 (활성 상태일 때만 표시) */}
          {status === "active" && (
            <>
              <div className="progress-wrapper w-full h-2.5 mb-3 bg-[#f3f5fa] rounded-sm overflow-hidden">
                <div
                  className="progress-fill h-full bg-[#2e6ff2] rounded-sm transition-all duration-300 ease-in-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <span className="progress-text mb-5 text-[#47494d]">
                {currentProgress}/{totalLessons}강 (
                {progressPercentage.toFixed(0)}%)
              </span>
            </>
          )}

          {/* 완료된 강의의 경우 완료 정보 표시 */}
          {status === "completed" && (
            <div className="mb-5">
              <span className="text-blue-600 font-medium">
                ✓ 강의를 완료했습니다!
              </span>
            </div>
          )}

          {/* 종료된 강의의 경우 안내 메시지 */}
          {status === "dropped" && (
            <div className="mb-5">
              <span className="text-gray-500">수강 기간이 만료되었습니다.</span>
            </div>
          )}

          <div className="lecture-btn-wrap flex gap-3 mt-auto">
            {statusInfo.showReapply ? (
              <button
                className="lecture-btn flex gap-2 items-center border rounded-[10px] py-[11px] px-5 text-[#121314] bg-white border-[#d9dbe0] font-medium justify-center flex-1 hover:bg-gray-50 transition-colors"
                onClick={onReapplyClick}
              >
                다시 수강 신청하기
              </button>
            ) : (
              <>
                <button
                  className="lecture-btn flex gap-2 items-center border-none rounded-[10px] py-[11px] px-5 text-white bg-[#2e6ff2] font-medium"
                  onClick={onLearnClick}
                >
                  <VideoIcon />
                  학습하기
                </button>
                <button
                  className="lecture-btn flex gap-2 items-center border rounded-[10px] py-[11px] px-5 text-[#121314] bg-white border-[#d9dbe0] font-medium"
                  onClick={onDetailClick}
                >
                  강의 상세
                </button>
              </>
            )}
          </div>
        </div>
      </article>
    );
  }
);

MyLectureCard.displayName = "MyLectureCard";

export default MyLectureCard;
