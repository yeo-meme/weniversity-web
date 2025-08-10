import React, { useEffect, useRef, useCallback } from "react";
// import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  fetchCourseDetail,
  setActiveTab,
  toggleChapterExpansion,
  toggleFAQExpansion,
  shareCourse,
  enrollCourse,
  resetCourseDetailState,
} from "../store/courseDetailSlice";
import type { TabType } from "../types/courseDetail";
import ExamImage from "../assets/exam.png";
import ShareIcon from "../assets/icon-Share.png";
import Step1 from "../assets/step-1.png";
import Step2 from "../assets/step-2.png";
import Step3 from "../assets/step-3.png";
import Step4 from "../assets/step-4.png";
import Step5 from "../assets/step-5.png";
import DownIcon from "../assets/icon-down.png";
import ExperienceTestimonials from "../components/courseDetail/ExperienceTestimonials";
import CurriculumSection from "../components/courseDetail/CurriculumSection";
import LearningSteps from "../components/courseDetail/LearningSteps";
import InstructorSection from "../components/courseDetail/InstructorSection";
import FAQSection from "../components/courseDetail/FAQSection";

interface TabInfo {
  key: TabType;
  label: string;
}

const CourseDetailPage: React.FC = () => {
  // const { id } = useParams<{ id: string }>();
  const id = "1"; // 임시 아이디
  const dispatch = useAppDispatch();
  const {
    courseDetail,
    activeTab,
    loading,
    error,
    shareLoading,
    enrollmentLoading,
  } = useAppSelector(state => state.courseDetail);

  // 각 섹션의 ref
  const sectionRefs = useRef<{ [key in TabType]: HTMLDivElement | null }>({
    overview: null,
    schedule: null,
    curriculum: null,
    instructor: null,
    faq: null,
    apply: null,
  });

  // 스크롤에 의한 탭 변경 시 자동 스크롤을 방지하기 위한 플래그
  const isScrollingProgrammatically = useRef(false);

  // 탭 목록
  const tabs: TabInfo[] = [
    { key: "overview", label: "강의 소개" },
    { key: "curriculum", label: "커리큘럼" },
    { key: "instructor", label: "강사 소개" },
    { key: "faq", label: "FAQ" },
    { key: "apply", label: "수강 신청" },
  ];

  useEffect(() => {
    if (id) {
      dispatch(fetchCourseDetail(id));
    }

    return () => {
      dispatch(resetCourseDetailState());
    };
  }, [dispatch, id]);

  // 스크롤 이벤트로 탭 변경 감지
  useEffect(() => {
    if (!courseDetail) return;

    const handleScroll = () => {
      // 프로그래밍적 스크롤 중이면 탭 변경 안함
      if (isScrollingProgrammatically.current) return;

      const windowHeight = window.innerHeight;
      const sections = Object.entries(sectionRefs.current)
        .map(([key, element]) => {
          if (!element) return null;

          const rect = element.getBoundingClientRect();
          const sectionHeight = rect.height;

          // 섹션이 화면에 보이는 부분 계산
          const visibleTop = Math.max(0, -rect.top);
          const visibleBottom = Math.min(
            sectionHeight,
            windowHeight - rect.top
          );
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);

          // 가시성 비율 계산 (0 ~ 1)
          const visibilityRatio =
            sectionHeight > 0 ? visibleHeight / sectionHeight : 0;

          return {
            id: key as TabType,
            element,
            visibilityRatio,
            top: rect.top,
          };
        })
        .filter(
          (section): section is NonNullable<typeof section> => section !== null
        );

      // 15% 이상 보이는 섹션들 중에서 가장 많이 보이는 섹션 선택
      const visibleSections = sections.filter(
        section => section.visibilityRatio >= 0.15
      );

      if (visibleSections.length > 0) {
        // 가장 많이 보이는 섹션 선택
        const mostVisibleSection = visibleSections.reduce((prev, current) =>
          current.visibilityRatio > prev.visibilityRatio ? current : prev
        );

        if (mostVisibleSection.id !== activeTab) {
          dispatch(setActiveTab(mostVisibleSection.id));
        }
      } else {
        // 15% 이상 보이는 섹션이 없다면, 화면 상단에 가장 가까운 섹션 선택
        const closestSection = sections.reduce((prev, current) =>
          Math.abs(current.top) < Math.abs(prev.top) ? current : prev
        );

        if (closestSection && closestSection.id !== activeTab) {
          dispatch(setActiveTab(closestSection.id));
        }
      }
    };

    // 스크롤 이벤트 등록
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener, { passive: true });

    // 초기 실행
    setTimeout(handleScroll, 300);

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, [courseDetail, dispatch, activeTab]);

  const handleTabClick = useCallback(
    (tabKey: TabType) => {
      dispatch(setActiveTab(tabKey));

      // 프로그래밍적 스크롤 시작
      isScrollingProgrammatically.current = true;

      // 해당 섹션으로 스크롤
      const targetSection = sectionRefs.current[tabKey];
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 46; // 탭 네비게이션 높이만큼 여유 공간
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });

        // 스크롤 완료 후 플래그 해제 (약간의 지연 후)
        setTimeout(() => {
          isScrollingProgrammatically.current = false;
        }, 1000);
      }
    },
    [dispatch]
  );

  const handleChapterToggle = (chapterId: string) => {
    dispatch(toggleChapterExpansion(chapterId));
  };

  const handleFAQToggle = (faqId: string) => {
    dispatch(toggleFAQExpansion(faqId));
  };

  const handleShareCourse = () => {
    if (id) {
      dispatch(shareCourse(id));
    }
  };

  const handleEnrollment = () => {
    if (id) {
      dispatch(enrollCourse(id));
    }
  };

  // 데이터는 slice에서 관리
  const curriculumData = courseDetail?.curriculum || [];
  const faqData = courseDetail?.faqs || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900">
            강의 정보를 불러오는 중...
          </div>
        </div>
      </div>
    );
  }

  if (!courseDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900">
            강의를 찾을 수 없습니다.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* 강의 소개 이미지 */}
      <div>
        <img src={ExamImage} alt="" />
      </div>

      {/* 강의 기본 정보 섹션 */}
      <div className="shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
            <div>
              {/* 강의 태그 정보 */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {courseDetail?.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`p-2 ${
                        index === 0
                          ? "bg-gray-600 text-white"
                          : "bg-blue-100 text-blue-600"
                      }  rounded-md text-xs`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 왼쪽: 강의 정보 */}
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                {courseDetail.title}
              </h3>

              <p className="text-gray-600 mb-6">{courseDetail.description}</p>

              {/* 강사 정보 */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  <img
                    src={courseDetail.instructor.profileImage}
                    alt="강사"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {courseDetail.instructor.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {courseDetail.instructor.role}
                  </p>
                </div>
              </div>

              {/* 교육 일정 */}
              <div className="p-8">
                <h4 className="font-semibold text-gray-900 mb-3">교육 일정</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <strong className="text-gray-400 mr-4">모집 기간</strong>
                    {courseDetail.schedule.recruitmentPeriod.start} ~{" "}
                    {courseDetail.schedule.recruitmentPeriod.end}
                  </p>
                  <p>
                    <strong className="text-gray-400 mr-4">교육 기간</strong>
                    {courseDetail.schedule.coursePeriod.start} ~{" "}
                    {courseDetail.schedule.coursePeriod.end} |{" "}
                    {courseDetail.schedule.coursePeriod.duration},{" "}
                    {courseDetail.schedule.coursePeriod.totalHours} |{" "}
                    {courseDetail.schedule.coursePeriod.schedule}
                  </p>
                </div>
              </div>
            </div>

            {/* 강의 정보 카드 */}
            <div>
              <div className="sticky top-4">
                <h3 className="font-bold mb-4">강의 정보</h3>
                <div className="text-center mb-6">
                  <div className="mt-8 py-4 border-t border-b border-gray-300 text-sm space-y-4">
                    <div className="flex">
                      <span className="text-left w-28 mr-4 text-gray-600">
                        교육 유형
                      </span>
                      <span className="font-medium">{courseDetail.type}</span>
                    </div>
                    <div className="flex">
                      <span className="text-left w-28 mr-4 text-gray-600">
                        주제
                      </span>
                      <span className="font-medium">
                        {courseDetail.subject}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-left w-28 mr-4 text-gray-600">
                        난이도
                      </span>
                      <span className="font-medium">{courseDetail.level}</span>
                    </div>
                    <div className="flex">
                      <span className="text-left w-28 mr-4 text-gray-600">
                        커리큘럼
                      </span>
                      <span className="font-medium">
                        {courseDetail.totalLessons}개 수업
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-left w-28 mr-4 text-gray-600">
                        수업 시간
                      </span>
                      <span className="font-medium">
                        {courseDetail.totalDuration}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-left w-28 mr-4 text-gray-600">
                        수강 기간
                      </span>
                      <span className="font-medium">
                        {courseDetail.validityPeriod}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <div className="text-left text-2xl font-bold text-gray-900">
                    ₩{courseDetail.price.toLocaleString()}
                  </div>
                </div>

                <button
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-3 disabled:opacity-50"
                  onClick={handleEnrollment}
                  disabled={enrollmentLoading}
                >
                  {enrollmentLoading ? "처리 중..." : "수강신청 하기"}
                </button>

                <button
                  className="flex justify-center items-center w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                  onClick={handleShareCourse}
                  disabled={shareLoading}
                >
                  <img src={ShareIcon} alt="" className="mr-2" />
                  {shareLoading ? "처리 중..." : "공유하기"}
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

      {/* 탭 네비게이션 */}
      <div className="mt-16 border-b border-gray-300 sticky top-0 bg-white z-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <nav className="flex justify-center items-center space-x-10 py-3">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                className={`font-medium ${
                  activeTab === tab.key
                    ? "text-gray-900"
                    : "text-gray-400 hover:text-blue-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 강의 소개 */}
        <div
          ref={el => {
            sectionRefs.current.overview = el;
          }}
        >
          <div className="bg-slate-700 py-16 px-8">
            <div className="text-center">
              <div className="mb-16">
                <p className="text-white text-4xl font-bold mb-4">
                  대 AI 시대,
                </p>
                <p className="text-white text-4xl font-bold mb-8">
                  개발을 어떻게 배우고 익혀야 할까요?
                </p>

                <div className="text-white text-2xl font-bold  leading-relaxed">
                  <p className="mb-2">위니브는 단순한 문법 강의가 아닌</p>
                  <p>'배우는 방법' 자체를 바꾸는 다섯 가지 방식을 제안합니다</p>
                </div>
              </div>

              <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <li className="flex flex-col items-center">
                  <div className="w-40 h-40 justify-center mb-6">
                    <img src={Step1} alt="" />
                  </div>
                  <p className="text-white text-sm font-medium text-center">
                    생성형 AI 기반 학습
                  </p>
                </li>
                <li className="flex flex-col items-center">
                  <div className="w-40 h-40 justify-center mb-6">
                    <img src={Step2} alt="" />
                  </div>
                  <p className="text-white text-sm font-medium text-center">
                    커뮤니티 학습
                  </p>
                </li>
                <li className="flex flex-col items-center">
                  <div className="w-40 h-40 justify-center mb-6">
                    <img src={Step3} alt="" />
                  </div>
                  <p className="text-white text-sm font-medium text-center">
                    맞춤형 온라인 VOD 강의
                  </p>
                </li>
                <li className="flex flex-col items-center">
                  <div className="w-40 h-40 justify-center mb-6">
                    <img src={Step4} alt="" />
                  </div>
                  <p className="text-white text-sm font-medium text-center">
                    전문가의 큐레이션
                  </p>
                </li>
                <li className="flex flex-col items-center">
                  <div className="w-40 h-40 justify-center mb-6">
                    <img src={Step5} alt="" />
                  </div>
                  <p className="text-white text-sm font-medium text-center">
                    바이브 코딩
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <LearningSteps />
          <ExperienceTestimonials />
        </div>

        {/* 커리큘럼 */}
        <div
          ref={el => {
            sectionRefs.current.curriculum = el;
          }}
          className="py-20"
        >
          <CurriculumSection
            schedule={courseDetail.schedule}
            curriculumData={curriculumData}
            onChapterToggle={handleChapterToggle}
          />
        </div>

        {/* 강사 소개 */}
        <div
          ref={el => {
            sectionRefs.current.instructor = el;
          }}
          className="mb-14 pb-10"
        >
          <InstructorSection instructor={courseDetail.instructor} />
        </div>

        {/* FAQ */}
        <div
          ref={el => {
            sectionRefs.current.faq = el;
          }}
          className="mb-80"
        >
          <FAQSection faqData={faqData} onFAQToggle={handleFAQToggle} />
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
