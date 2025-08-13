import React from "react";
import type { CourseDetailInfo, TabType } from "../../types/courseDetail";
import ExperienceTestimonials from "./ExperienceTestimonials";
import CurriculumSection from "./CurriculumSection";
import LearningSteps from "./LearningSteps";
import InstructorSection from "./InstructorSection";
import FAQSection from "./FAQSection";
import LearningMethods from "./LearningMethods";

interface CourseContentProps {
  courseDetail: CourseDetailInfo;
  sectionRefs: React.RefObject<{
    [key in TabType]: HTMLDivElement | null;
  }>;
  onChapterToggle: (chapterId: number) => void;
}

const CourseContent: React.FC<CourseContentProps> = ({
  courseDetail,
  sectionRefs,
  onChapterToggle,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 강의 소개 */}
      <div
        ref={el => {
          if (sectionRefs.current) {
            sectionRefs.current.overview = el;
          }
        }}
        className="mb-20"
      >
        <LearningMethods />
        <LearningSteps />
        <ExperienceTestimonials />
      </div>

      {/* 커리큘럼 */}
      <div
        ref={el => {
          if (sectionRefs.current) {
            sectionRefs.current.curriculum = el;
          }
        }}
        className="pb-20"
      >
        <CurriculumSection
          chapters={courseDetail.chapters}
          onChapterToggle={onChapterToggle}
        />
      </div>

      {/* 강사 소개 */}
      <div
        ref={el => {
          if (sectionRefs.current) {
            sectionRefs.current.instructor = el;
          }
        }}
        className="mb-14 pb-10"
      >
        <InstructorSection instructor={courseDetail.instructors[0]} />
      </div>

      {/* FAQ */}
      <div
        ref={el => {
          if (sectionRefs.current) {
            sectionRefs.current.faq = el;
          }
        }}
        className="mb-80"
      >
        <FAQSection />
      </div>
    </div>
  );
};

export default React.memo(CourseContent);
