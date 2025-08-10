import React from "react";
import type { CourseChapter, CourseSchedule } from "../../types/courseDetail";
import PlayIcon from "../../assets/icon-play.png";
import DownIcon from "../../assets/icon-down.png";
import CheckFillIcon from "../../assets/icon-Check-fill.png";
import CheckEmptyIcon from "../../assets/icon-Check-empty.png";

interface CurriculumSectionProps {
  schedule: CourseSchedule;
  curriculumData: CourseChapter[];
  onChapterToggle: (chapterId: string) => void;
}

const CurriculumSection: React.FC<CurriculumSectionProps> = ({
  schedule,
  curriculumData,
  onChapterToggle,
}) => {
  return (
    <>
      <div className="flex flex-col justify-center items-center mb-10">
        <h3 className="text-xl font-bold mb-2">커리큘럼</h3>
        <p className="text-blue-600 font-medium">
          {schedule.coursePeriod.duration}, 총{" "}
          {schedule.coursePeriod.totalHours}
        </p>
      </div>

      <ul>
        {curriculumData.map((section, o) => (
          <li key={section.id}>
            <div
              className={`bg-gray-100 border border-gray-200 w-full flex items-center justify-start p-4 text-left ${
                o === 0 ? "rounded-t-lg border-b-0" : ""
              } ${
                o === curriculumData.length - 1 && !section.isExpanded
                  ? "rounded-b-lg"
                  : ""
              } ${section.isExpanded && "border-b-0"}`}
            >
              <button onClick={() => onChapterToggle(section.id)}>
                <img
                  src={DownIcon}
                  alt=""
                  className="w-5 h-5 bg-white rounded"
                />
              </button>
              <h4 className="font-semibold text-gray-900 ml-3">
                {section.title}
              </h4>
            </div>

            {section.isExpanded && (
              <ul className="">
                {section.lessons.map((lesson, i) => (
                  <li
                    key={lesson.id}
                    className={`flex items-center justify-between p-4 pl-16 hover:bg-gray-100 border-gray-200 border-r border-l border-b ${
                      o === curriculumData.length - 1 &&
                      i === section.lessons.length - 1
                        ? "rounded-b-lg"
                        : ""
                    } ${
                      o !== curriculumData.length - 1 &&
                      i === section.lessons.length - 1 &&
                      "border-b-0"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <img src={PlayIcon} alt="" />
                      </div>
                      <span className="text-sm text-gray-900">
                        {lesson.title}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        {lesson.duration}
                      </span>
                      <div className="w-4 h-4 flex items-center justify-center">
                        {lesson.isCompleted && !lesson.isActive ? (
                          <img src={CheckFillIcon} alt="" />
                        ) : (
                          <img src={CheckEmptyIcon} alt="" />
                        )}
                      </div>
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
