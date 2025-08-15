import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import {
  fetchCourseDetail,
  setActiveTab,
  toggleChapterExpansion,
  resetCourseDetailState,
} from "../../store/courseDetailSlice";
import type { TabType } from "../../types/courseDetail/courseDetail";
import CourseHeader from "../../components/courseDetail/CourseHeader";
import CourseInfo from "../../components/courseDetail/CourseInfo";
import TabNavigation from "../../components/courseDetail/TabNavigation";
import CourseContent from "../../components/courseDetail/CourseContent";
import LoadingMessage from "../../components/courseDetail/LoadingMessage";
import { ErrorMessage } from "../../components/courseDetail/ErrorMessage";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetailPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
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
  const tabs = useMemo(
    () => [
      { key: "overview" as TabType, label: "강의 소개" },
      { key: "curriculum" as TabType, label: "커리큘럼" },
      { key: "instructor" as TabType, label: "강사 소개" },
      { key: "faq" as TabType, label: "FAQ" },
      { key: "apply" as TabType, label: "수강 신청" },
    ],
    []
  );

  // 날짜 포맷팅 함수
  const formatDateRange = useCallback((dateStr: string) => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const startDate = new Date(dateStr);
    const endDate = new Date(startDate);

    endDate.setMonth(endDate.getMonth() + 1);

    const format = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      const dayName = days[date.getDay()];
      return `${y}.${m}.${d}(${dayName})`;
    };

    return `${format(startDate)} ~ ${format(endDate)}`;
  }, []);

  // 스크롤 핸들러
  const handleScroll = useCallback(() => {
    if (isScrollingProgrammatically.current || !courseDetail) return;

    const windowHeight = window.innerHeight;
    const sections = Object.entries(sectionRefs.current)
      .map(([key, element]) => {
        if (!element) return null;

        const rect = element.getBoundingClientRect();
        const sectionHeight = rect.height;

        const visibleTop = Math.max(0, -rect.top);
        const visibleBottom = Math.min(sectionHeight, windowHeight - rect.top);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
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

    const visibleSections = sections.filter(
      section => section.visibilityRatio >= 0.15
    );

    if (visibleSections.length > 0) {
      const mostVisibleSection = visibleSections.reduce((prev, current) =>
        current.visibilityRatio > prev.visibilityRatio ? current : prev
      );

      if (mostVisibleSection.id !== activeTab) {
        dispatch(setActiveTab(mostVisibleSection.id));
      }
    } else {
      const closestSection = sections.reduce((prev, current) =>
        Math.abs(current.top) < Math.abs(prev.top) ? current : prev
      );

      if (closestSection && closestSection.id !== activeTab) {
        dispatch(setActiveTab(closestSection.id));
      }
    }
  }, [courseDetail, dispatch, activeTab]);

  // 탭 클릭 핸들러
  const handleTabClick = useCallback(
    (tabKey: TabType) => {
      dispatch(setActiveTab(tabKey));
      isScrollingProgrammatically.current = true;

      const targetSection = sectionRefs.current[tabKey];
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 46;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });

        setTimeout(() => {
          isScrollingProgrammatically.current = false;
        }, 1000);
      }
    },
    [dispatch]
  );

  // 챕터 토글 핸들러
  const handleChapterToggle = useCallback(
    (chapterId: number) => {
      dispatch(toggleChapterExpansion(chapterId));
    },
    [dispatch]
  );

  // 공유 핸들러
  const handleShareCourse = useCallback(() => {
    alert("공유하기 기능은 개발중입니다.");
  }, []);

  // 수강신청 핸들러
  const handleEnrollment = useCallback(
    (title: string) => {
      alert(`"${title}" 수강신청이 완료되었습니다.`);
      navigate("/");
    },
    [navigate]
  );

  // 강의 데이터 fetch
  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseDetail(courseId));
    }

    return () => {
      dispatch(resetCourseDetailState());
    };
  }, [dispatch, courseId]);

  // 스크롤 이벤트 등록
  useEffect(() => {
    if (!courseDetail) return;

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
    setTimeout(handleScroll, 300);

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, [courseDetail, handleScroll]);

  // 로딩 상태
  if (loading) {
    return <LoadingMessage message="강의 정보를 불러오는 중..." />;
  }

  // 강의 정보가 없는 경우
  if (!courseDetail) {
    return <ErrorMessage message="강의를 찾을 수 없습니다." />;
  }

  return (
    <div className="min-h-screen mt-14">
      {/* 강의 헤더 */}
      <CourseHeader />

      {/* 강의 기본 정보 섹션 */}
      <CourseInfo
        courseDetail={courseDetail}
        formatDateRange={formatDateRange}
        onShare={handleShareCourse}
        onEnrollment={handleEnrollment}
        error={error}
      />

      {/* 탭 네비게이션 */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={handleTabClick}
      />

      {/* 강의 콘텐츠 */}
      <CourseContent
        courseDetail={courseDetail}
        sectionRefs={sectionRefs}
        onChapterToggle={handleChapterToggle}
      />
    </div>
  );
};

export default React.memo(CourseDetailPage);
