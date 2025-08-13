import React, { useMemo } from "react";
import type { CourseInstructor } from "../../types/courseDetail";

interface InstructorSectionProps {
  instructor: CourseInstructor;
}

const InstructorSection: React.FC<InstructorSectionProps> = ({
  instructor,
}) => {
  const instructorData = useMemo(
    () => ({
      current: [
        "주식회사 위니브 대표",
        "바울랩(학원, 연구원, 출판사 3사) 대표",
        "제주코딩베이스캠프 운영진",
        "제주앱 고리좀배이스캠프 운영진",
      ],
      previous: [
        "제주스타트업협회 부회장",
        "신한금융그룹 신한데이터시스템 정보보안 담당",
      ],
      education: ["제주대학교"],
      achievements: [
        "믹스웨어 개발 기조 강의 발표라마",
        "멋쟁이사자처럼 테킷(TECHIT) 프론트엔드 스쿨 1~9기 주강사",
        "EST 백엔드 스쿨",
      ],
    }),
    []
  );

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-6">
        <h3 className="text-4xl font-bold mb-3">강사소개</h3>
        <p className="text-blue-600 font-medium mb-10">
          부트캠프 수료율 100%의 비결을 수강생들 한명 '진심'입니다.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
        <div className="w-60 h-60 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={instructor.profile_image}
            alt="강사"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <p className="mb-6 flex items-center text-2xl font-bold text-gray-900">
            {instructor.name}{" "}
            <span className="ml-2 text-base text-gray-400 font-normal">
              {instructor.english_name}
            </span>
          </p>

          <div className="mb-6 space-y-2 text-gray-700">
            {instructorData.current.map((position, index) => (
              <p key={index}>
                <span className="mr-2 text-blue-600">現</span> {position}
              </p>
            ))}
            {instructorData.previous.map((position, index) => (
              <p key={index}>
                <span className="mr-2 text-gray-500">前</span> {position}
              </p>
            ))}
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p className="mb-2 text-base text-gray-900 font-bold">
              [강사 이력]
            </p>
            {instructorData.education.map((edu, index) => (
              <p key={index}>{edu}</p>
            ))}
            {instructorData.achievements.map((achievement, index) => (
              <p key={index}>{achievement}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(InstructorSection);
