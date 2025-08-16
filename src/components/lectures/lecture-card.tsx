import React from "react";
import { VideoIcon } from "../common/icon.tsx";
import { useNavigate } from "react-router-dom";


interface Tag {
  text: string;
  type: "type" | "kind";
}

interface LectureCardProps {
  thumbnailSrc: string;
  thumbnailAlt?: string;
  tags: Tag[];
  title: string;
  currentProgress: number;
  totalLessons: number;
  progressPercentage: number;
  isExpired?: boolean;
  onLearnClick?: () => void;
  onDetailClick?: () => void;
  onReapplyClick?: () => void;
}

const LectureCard: React.FC<LectureCardProps> = ({
  thumbnailSrc,
  thumbnailAlt = "강의 썸네일",
  tags,
  title,
  currentProgress,
  totalLessons,
  progressPercentage,
  isExpired = false,
  onLearnClick,
  onDetailClick,
  onReapplyClick,
}) => {
  const navigate = useNavigate();

  const handleLectureClick = () => {
    navigate(`/studyplayer`); // URL 경로는 필요에 맞게 설정
  };

  return (
    <article className="lecture-card max-w-[380px] flex flex-col"
    onClick={() => handleLectureClick()}>
      <div className="thumbnail-wrapper relative w-[380px] h-[200px] mb-5">
        <img
          src={thumbnailSrc}
          className="thumbnail-img w-full h-full mb-0"
          alt={thumbnailAlt}
        />
        {isExpired && (
          <div className="end-overlay absolute top-0 left-0 flex items-center justify-center w-full h-full text-white bg-black/70 rounded-[10px] text-base font-medium">
            수강 기간이 종료되었습니다.
          </div>
        )}
      </div>

      <div className="tag-wrap flex gap-3 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`tag px-3 py-1.5 rounded-md text-sm font-semibold ${
              tag.type === "type"
                ? "tag-type text-white bg-[#47494d]"
                : "tag-kind text-[#2e6ff2] bg-[#dee8ff]"
            }`}
          >
            {tag.text}
          </span>
        ))}
      </div>

      <h3 className="lecture-title text-lg font-semibold mb-4 h-14 overflow-hidden leading-6">
        <span className="line-clamp-2">{title}</span>
      </h3>

      <div className="progress-wrapper w-full h-2.5 mb-3 bg-[#f3f5fa] rounded-sm overflow-hidden">
        <div
          className="progress-fill h-full bg-[#2e6ff2] rounded-sm transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <span className="progress-text mb-5 text-[#47494d]">
        {currentProgress}/{totalLessons}강 ({progressPercentage}%)
      </span>

      <div className="lecture-btn-wrap flex gap-3">
        {isExpired ? (
          <button
            className="lecture-btn flex gap-2 items-center border rounded-[10px] py-[11px] px-5 text-[#121314] bg-white border-[#d9dbe0] font-medium justify-center"
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
    </article>
  );
};

export default LectureCard;
