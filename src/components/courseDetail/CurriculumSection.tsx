import React, { useMemo, useCallback } from "react";
import type { CourseChapter } from "../../types/courseDetail/courseDetail";
import PlayIcon from "../../assets/icon-play.png";
import DownIcon from "../../assets/icon-down.png";
import CheckFillIcon from "../../assets/icon-Check-fill.png";

interface CurriculumSectionProps {
  chapters: CourseChapter[];
  onChapterToggle: (chapterId: number) => void;
}

interface ChapterItemProps {
  chapter: CourseChapter;
  index: number;
  isLast: boolean;
  onToggle: (chapterId: number) => void;
  formatDuration: (seconds: number) => string;
}

// 개별 챕터 컴포넌트
const ChapterItem: React.FC<ChapterItemProps> = React.memo(
  ({ chapter, index, isLast, onToggle, formatDuration }) => {
    const handleToggle = useCallback(() => {
      onToggle(chapter.chapter_id);
    }, [onToggle, chapter.chapter_id]);

    return (
      <li>
        <div
          className={`bg-gray-100 border border-gray-200 w-full flex items-center justify-start p-4 text-left ${
            index === 0 ? "rounded-t-lg border-b-0" : ""
          } ${isLast && !chapter.isExpanded ? "rounded-b-lg" : ""} ${
            chapter.isExpanded && "border-b-0"
          }`}
        >
          <button onClick={handleToggle}>
            <img src={DownIcon} alt="" className="w-5 h-5 bg-white rounded" />
          </button>
          <h4 className="font-semibold text-gray-900 ml-3">{chapter.title}</h4>
        </div>

        {chapter.isExpanded && (
          <ul>
            {chapter.videos.map((video, videoIndex) => (
              <li
                key={video.video_id}
                className={`flex items-center justify-between p-4 pl-16 hover:bg-gray-100 border-gray-200 border-r border-l border-b ${
                  isLast && videoIndex === chapter.videos.length - 1
                    ? "rounded-b-lg"
                    : ""
                } ${
                  !isLast &&
                  videoIndex === chapter.videos.length - 1 &&
                  "border-b-0"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <img src={PlayIcon} alt="" />
                  </div>
                  <span className="text-sm text-gray-900">{video.title}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    {formatDuration(video.duration)}
                  </span>
                  <img src={CheckFillIcon} alt="" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }
);

ChapterItem.displayName = "ChapterItem";

const CurriculumSection: React.FC<CurriculumSectionProps> = ({
  chapters,
  onChapterToggle,
}) => {
  // duration 포맷팅 함수
  const formatDuration = useCallback((seconds: number): string => {
    if (seconds < 0) return "0:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
  }, []);

  // 총 학습 시간 계산
  const totalDurationText = useMemo(() => {
    const totalSeconds = chapters.reduce((total, chapter) => {
      const chapterDuration = chapter.videos.reduce((chapterTotal, video) => {
        return chapterTotal + video.duration;
      }, 0);
      return total + chapterDuration;
    }, 0);

    if (totalSeconds === 0) return "0분";

    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const parts: string[] = [];

    if (days > 0) parts.push(`${days}일`);
    if (hours > 0) parts.push(`${hours}시간`);
    if (minutes > 0) parts.push(`${minutes}분`);

    return parts.join(" ");
  }, [chapters]);

  return (
    <>
      <div className="flex flex-col justify-center items-center mb-10">
        <h3 className="text-xl font-bold mb-2">커리큘럼</h3>
        <p className="text-blue-600 font-medium">총 {totalDurationText}</p>
      </div>

      <ul>
        {chapters.map((chapter, index) => (
          <ChapterItem
            key={chapter.chapter_id}
            chapter={chapter}
            index={index}
            isLast={index === chapters.length - 1}
            onToggle={onChapterToggle}
            formatDuration={formatDuration}
          />
        ))}
      </ul>
    </>
  );
};

export default React.memo(CurriculumSection);
