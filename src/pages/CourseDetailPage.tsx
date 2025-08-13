import React, { useEffect, useRef, useCallback } from "react";
// import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  fetchCourseDetail,
  setActiveTab,
  toggleChapterExpansion,
  resetCourseDetailState,
} from "../store/courseDetailSlice";
import type { TabType } from "../types/courseDetail";
import ExamImage from "../assets/exam.png";
import ShareIcon from "../assets/icon-Share.png";
import ExperienceTestimonials from "../components/courseDetail/ExperienceTestimonials";
import CurriculumSection from "../components/courseDetail/CurriculumSection";
import LearningSteps from "../components/courseDetail/LearningSteps";
import InstructorSection from "../components/courseDetail/InstructorSection";
import FAQSection from "../components/courseDetail/FAQSection";
import LearningMethods from "../components/courseDetail/LearningMethods";

interface TabInfo {
  key: TabType;
  label: string;
}

const CourseDetailPage: React.FC = () => {
  // const { id } = useParams<{ id: string }>();
  const id = "1"; // 임시 아이디
  const dispatch = useAppDispatch();
  const { courseDetail, activeTab, loading, error } = useAppSelector(
    state => state.courseDetail
  );

  // 각 섹션의 ref
  const sectionRefs = useRef<{ [key in TabType]: HTMLDivElement | null }>({
    overview: null,
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

      isScrollingProgrammatically.current = true;

      // 해당 섹션으로 스크롤
      const targetSection = sectionRefs.current[tabKey];
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 46; // 탭 네비게이션 높이만큼 여유 공간
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });

        // 스크롤 완료 후 플래그 해제
        setTimeout(() => {
          isScrollingProgrammatically.current = false;
        }, 1000);
      }
    },
    [dispatch]
  );

  const handleChapterToggle = (chapterId: number) => {
    dispatch(toggleChapterExpansion(chapterId));
  };

  const handleShareCourse = () => {
    alert("공유하기 기능은 개발중입니다.");
  };

  const handleEnrollment = () => {
    alert("수강신청 기능은 개발중입니다.");
  };

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

  const formatDateRange = (dateStr: string) => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const startDate = new Date(dateStr);
    const endDate = new Date(startDate);

    endDate.setMonth(endDate.getMonth() + 1); // 개시일로 부터 +1개월

    const format = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      const dayName = days[date.getDay()];
      return `${y}.${m}.${d}(${dayName})`;
    };

    return `${format(startDate)} ~ ${format(endDate)}`;
  };

  return (
    <div className="min-h-screen">
      {/* 강의 소개 이미지 */}
      <div>
        <img src={ExamImage} alt="" />
      </div>

      {/* 강의 기본 정보 섹션 */}
      <div>
        <div className="max-w-7xl mx-auto">
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
            <div>
              {/* 강의 태그 정보 */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  <span className="p-2 bg-gray-700 text-white rounded-md text-xs">
                    {courseDetail.type === "vod" ? "일반" : "부스트 커뮤니티"}
                  </span>
                  <span className="p-2 bg-blue-100 text-blue-700 rounded-md text-xs">
                    {courseDetail.category}
                  </span>
                  <span className="p-2 bg-green-100 text-green-700 rounded-md text-xs">
                    {courseDetail.level}
                  </span>
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
                    <div className="flex">
                      <span className="text-left w-28 mr-3 text-gray-600">
                        교육 유형
                      </span>
                      <span className="font-medium">
                        {courseDetail.type === "vod"
                          ? "일반"
                          : "부스트 커뮤니티"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-left w-28 mr-3 text-gray-600">
                        주제
                      </span>
                      <span className="font-medium">
                        {courseDetail.category} 개발
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-left w-28 mr-3 text-gray-600">
                        난이도
                      </span>
                      <span className="font-medium">{courseDetail.level}</span>
                    </div>
                    <div className="flex">
                      <span className="text-left w-28 mr-3 text-gray-600">
                        커리큘럼
                      </span>
                      <span className="font-medium">
                        {courseDetail.chapters.length}개 수업
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-left w-28 mr-3 text-gray-600">
                        소요 시간
                      </span>
                      <span className="font-medium">
                        {courseDetail.chapters.length} 시간
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-left w-28 mr-3 text-gray-600">
                        수강 기간
                      </span>
                      <span className="font-medium">6개월</span>
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
                >
                  수강신청 하기
                </button>

                <button
                  className="flex justify-center items-center w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                  onClick={handleShareCourse}
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
          className="mb-20"
        >
          <LearningMethods />
          <LearningSteps />
          <ExperienceTestimonials />
        </div>

        {/* 커리큘럼 */}
        <div
          ref={el => {
            sectionRefs.current.curriculum = el;
          }}
          className="pb-20"
        >
          <CurriculumSection
            chapters={courseDetail.chapters}
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
          <InstructorSection instructor={courseDetail.instructors[0]} />
        </div>

        {/* FAQ */}
        <div
          ref={el => {
            sectionRefs.current.faq = el;
          }}
          className="mb-80"
        >
          <FAQSection />
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
