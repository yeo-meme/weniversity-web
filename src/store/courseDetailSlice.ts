import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  CourseDetailInfo,
  CourseDetailState,
  TabType,
} from "../types/courseDetail";

// 강의 상세 정보 가져오기
export const fetchCourseDetail = createAsyncThunk<CourseDetailInfo, string>(
  "courseDetail/fetchCourseDetail",
  async (courseId: string) => {
    // 실제 API 호출로 대체 예정
    // const response = await fetch(`http://13.125.180.222/api/courses/${courseId}/`);
    // if (!response.ok) {
    //   throw new Error("강의 상세 정보를 불러오는데 실패했습니다.");
    // }
    // return await response.json();

    // 더미 데이터
    return {
      id: courseId,
      title: "견고한 파이썬 부스트 커뮤니티 1기 (디스코드 커뮤니티)",
      subtitle: "파이썬과 백엔드의 세계로 떠나는 여행",
      description:
        "파이썬은 어려운 언어가 아닙니다! 커뮤니티에서 함께 소통하며 백엔드의 세계를 몸소 체험하고, 실무 프로젝트를 통해 성장해보세요.",
      instructor: {
        id: "instructor_1",
        name: "이호준",
        englishName: "Hojun Lee",
        profileImage: "http://13.125.180.222/media/profiles/lion_XanRGlS.jpg",
        role: "주식회사 위니브 CPO",
        currentPositions: [
          "주식회사 위니브 대표",
          "바울랩(학원, 연구원, 출판사 3사) 대표",
          "제주코딩베이스캠프 운영진",
          "제주앱 고리좀배이스캠프 운영진",
        ],
        previousPositions: [
          "제주스타트업협회 부회장",
          "신한금융그룹 신한데이터시스템 정보보안 담당",
        ],
        education: ["제주대학교"],
        achievements: [
          "믹스웨어 개발 기조 강의 발표라마",
          "멋쟁이사자처럼 테킷(TECHIT) 프론트엔드 스쿨 1~9기 주강사",
          "EST 백엔드 스쿨",
        ],
        bio: "부트캠프 수료율 100%의 비결을 수강생들 한명 '진심'입니다.",
      },
      category: "백엔드",
      level: "초급",
      type: "부스트 커뮤니티",
      subject: "백엔드 개발",
      price: 200000,
      currency: "KRW",
      thumbnailImage: "http://13.125.180.222/media/profiles/lion_XanRGlS.jpg",
      bannerImage: "",
      totalLessons: 52,
      totalDuration: "142시간 18분",
      validityPeriod: "6개월",
      tags: ["부스트 커뮤니티", "백엔드", "초급", "무료"],
      schedule: {
        recruitmentPeriod: {
          start: "2023-01-08",
          end: "2023-01-08",
        },
        coursePeriod: {
          start: "2024-01-08",
          end: "2024-01-12",
          duration: "5일",
          totalHours: "30시간",
          schedule: "10:00 ~ 17:00",
        },
      },
      curriculum: [
        {
          id: "chapter_1",
          title: "Chapter00. 들어가기 전",
          isExpanded: true,
          lessons: [
            {
              id: "lesson_1_1",
              title: "1. 연상과 구문",
              duration: "12:00",
              isCompleted: true,
            },
            {
              id: "lesson_1_2",
              title: "1. 연상과 구문",
              duration: "12:00",
              isCompleted: true,
            },
            {
              id: "lesson_1_3",
              title: "1. 연상과 구문",
              duration: "12:00",
              isCompleted: true,
            },
          ],
        },
        {
          id: "chapter_2",
          title: "Chapter00. 들어가기 전",
          isExpanded: true,
          lessons: [
            {
              id: "lesson_2_1",
              title: "1. 연상과 구문",
              duration: "12:00",
              isCompleted: true,
            },
            {
              id: "lesson_2_2",
              title: "1. 연상과 구문",
              duration: "12:00",
              isCompleted: true,
            },
            {
              id: "lesson_2_3",
              title: "1. 연상과 구문",
              duration: "12:00",
              isCompleted: false,
            },
            {
              id: "lesson_2_4",
              title: "1. 연상과 구문",
              duration: "12:00",
              isCompleted: false,
              isActive: true,
            },
            {
              id: "lesson_2_5",
              title: "1. 연상과 구문",
              duration: "12:00",
              isCompleted: false,
            },
            {
              id: "lesson_2_6",
              title: "1. 연상과 구문",
              duration: "12:00",
              isCompleted: false,
            },
          ],
        },
      ],
      faqs: [
        {
          id: "faq_1",
          question: "프로그래밍이 처음인데 괜찮을까요?",
          answer: "",
          isExpanded: false,
        },
        {
          id: "faq_2",
          question: "교육은 꼭 정해진 시간에만 수강할 수 있나요?",
          answer:
            "아니요. VOD 강의는 학습기간 동안 자유롭게 수강하실 수 있습니다. 다만 함께 모여 공부하고, 실시간 질의응답하며 함께 학습의 효과를 높이기 위해 매일 오후 7시~9시를 CORE STUDY TIME 으로 정하여 운영하고 있습니다.",
          isExpanded: true,
        },
        {
          id: "faq_3",
          question: "프로그래밍이 처음인데 괜찮을까요?",
          answer: "",
          isExpanded: false,
        },
        {
          id: "faq_4",
          question: "프로그래밍이 처음인데 괜찮을까요?",
          answer: "",
          isExpanded: false,
        },
      ],
      enrollmentCount: 1247,
      rating: 4.8,
    };
  }
);

// 공유하기
export const shareCourse = createAsyncThunk<void, string>(
  "courseDetail/shareCourse",
  async (courseId: string) => {
    // 실제 공유 로직으로 대체 예정
    // 예: Web Share API 사용하거나 클립보드에 URL 복사

    // 더미 응답 (실제로는 공유 기능 구현)
    await new Promise(resolve => setTimeout(resolve, 500));

    // 브라우저에서 Web Share API 지원 확인
    if (navigator.share) {
      await navigator.share({
        title: "강의 공유",
        text: "이 강의를 확인해보세요!",
        url: window.location.href,
      });
    } else {
      // 클립보드에 URL 복사
      await navigator.clipboard.writeText(window.location.href);
      alert("링크가 클립보드에 복사되었습니다!");
    }
  }
);

// 수강신청
export const enrollCourse = createAsyncThunk<void, string>(
  "courseDetail/enrollCourse",
  async (courseId: string) => {
    // 실제 API 호출로 대체 예정
    // const response = await fetch(`http://13.125.180.222/api/courses/${courseId}/enroll/`, {
    //   method: "POST"
    // });
    // if (!response.ok) {
    //   throw new Error("수강신청에 실패했습니다.");
    // }

    // 더미 응답
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
);

const initialState: CourseDetailState = {
  courseDetail: null,
  activeTab: "overview",
  loading: false,
  error: null,
  shareLoading: false,
  enrollmentLoading: false,
};

const courseDetailSlice = createSlice({
  name: "courseDetail",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<TabType>) => {
      state.activeTab = action.payload;
    },
    toggleChapterExpansion: (state, action: PayloadAction<string>) => {
      if (state.courseDetail) {
        const chapter = state.courseDetail.curriculum.find(
          c => c.id === action.payload
        );
        if (chapter) {
          chapter.isExpanded = !chapter.isExpanded;
        }
      }
    },
    toggleFAQExpansion: (state, action: PayloadAction<string>) => {
      if (state.courseDetail) {
        const faq = state.courseDetail.faqs.find(f => f.id === action.payload);
        if (faq) {
          faq.isExpanded = !faq.isExpanded;
        }
      }
    },
    setActiveLesson: (state, action: PayloadAction<string>) => {
      if (state.courseDetail) {
        // 모든 레슨의 active 상태 해제
        state.courseDetail.curriculum.forEach(chapter => {
          chapter.lessons.forEach(lesson => {
            lesson.isActive = lesson.id === action.payload;
          });
        });
      }
    },
    resetCourseDetailState: state => {
      state.courseDetail = null;
      state.activeTab = "overview";
      state.loading = false;
      state.error = null;
      state.shareLoading = false;
      state.enrollmentLoading = false;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // 강의 상세 정보 가져오기
      .addCase(fetchCourseDetail.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.courseDetail = action.payload;
      })
      .addCase(fetchCourseDetail.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "강의 정보를 불러오는데 실패했습니다.";
      })

      // 공유하기
      .addCase(shareCourse.pending, state => {
        state.shareLoading = true;
        state.error = null;
      })
      .addCase(shareCourse.fulfilled, state => {
        state.shareLoading = false;
        // 공유 성공 시 추가 로직 (예: 성공 메시지 표시)
      })
      .addCase(shareCourse.rejected, (state, action) => {
        state.shareLoading = false;
        state.error = action.error.message || "공유하기에 실패했습니다.";
      })

      // 수강신청
      .addCase(enrollCourse.pending, state => {
        state.enrollmentLoading = true;
        state.error = null;
      })
      .addCase(enrollCourse.fulfilled, state => {
        state.enrollmentLoading = false;
        // 수강신청 성공 시 추가 로직 (예: 성공 메시지 표시)
      })
      .addCase(enrollCourse.rejected, (state, action) => {
        state.enrollmentLoading = false;
        state.error = action.error.message || "수강신청에 실패했습니다.";
      });
  },
});

export const {
  setActiveTab,
  toggleChapterExpansion,
  toggleFAQExpansion,
  setActiveLesson,
  resetCourseDetailState,
  clearError,
} = courseDetailSlice.actions;

export default courseDetailSlice.reducer;
