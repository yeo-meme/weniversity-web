import React from "react";
import type { CourseChapter } from "../../types/courseDetail";
import PlayIcon from "../../assets/icon-play.png";
import DownIcon from "../../assets/icon-down.png";
import CheckFillIcon from "../../assets/icon-Check-fill.png";
// import CheckEmptyIcon from "../../assets/icon-Check-empty.png";

interface CurriculumSectionProps {
  chapters: CourseChapter[];
  onChapterToggle: (chapterId: number) => void;
}

const CurriculumSection: React.FC<CurriculumSectionProps> = ({
  chapters,
  onChapterToggle,
}) => {
  // chapters 배열에서 모든 video의 duration을 합산하여 "X일 X시간" 형태로 반환하는 함수
  const getTotalDurationText = (chapters: CourseChapter[]): string => {
    // 모든 chapters의 videos에서 duration 합산
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
  };

  // duration(초)을 받아서 HH:MM:SS 또는 MM:SS 형태로 반환하는 함수
  const formatDuration = (seconds: number): string => {
    if (seconds < 0) return "0:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      // 1시간 이상일 때: H:MM:SS 형태
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    } else {
      // 1시간 미만일 때: MM:SS 형태
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
  };

  // CourseData 전체에서 총 학습 시간을 계산하는 함수
  const getTotalCourseTime = (chapters: CourseChapter[]): string => {
    return getTotalDurationText(chapters);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center mb-10">
        <h3 className="text-xl font-bold mb-2">커리큘럼</h3>
        <p className="text-blue-600 font-medium">
          총 {getTotalCourseTime(chapters)}
        </p>
      </div>

      <ul>
        {chapters.map((chapter, o) => (
          <li key={chapter.chapter_id}>
            <div
              className={`bg-gray-100 border border-gray-200 w-full flex items-center justify-start p-4 text-left ${
                o === 0 ? "rounded-t-lg border-b-0" : ""
              } ${
                o === chapters.length - 1 && !chapter.isExpanded
                  ? "rounded-b-lg"
                  : ""
              } ${chapter.isExpanded && "border-b-0"}`}
            >
              <button onClick={() => onChapterToggle(chapter.chapter_id)}>
                <img
                  src={DownIcon}
                  alt=""
                  className="w-5 h-5 bg-white rounded"
                />
              </button>
              <h4 className="font-semibold text-gray-900 ml-3">
                {chapter.title}
              </h4>
            </div>

            {chapter.isExpanded && (
              <ul className="">
                {chapter.videos.map((video, i) => (
                  <li
                    key={video.video_id}
                    className={`flex items-center justify-between p-4 pl-16 hover:bg-gray-100 border-gray-200 border-r border-l border-b ${
                      o === chapters.length - 1 &&
                      i === chapter.videos.length - 1
                        ? "rounded-b-lg"
                        : ""
                    } ${
                      o !== chapters.length - 1 &&
                      i === chapter.videos.length - 1 &&
                      "border-b-0"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <img src={PlayIcon} alt="" />
                      </div>
                      <span className="text-sm text-gray-900">
                        {video.title}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        {formatDuration(video.duration)}
                      </span>
                      <img src={CheckFillIcon} alt="" />
                      {/* <div className="w-4 h-4 flex items-center justify-center">
                        {video.isCompleted && !video.isActive ? (
                          <img src={CheckFillIcon} alt="" />
                        ) : (
                          <img src={CheckEmptyIcon} alt="" />
                        )}
                      </div> */}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default CurriculumSection;
