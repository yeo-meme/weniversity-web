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
    const response = await fetch(
      `http://13.125.180.222/api/courses/${courseId}/`
    );

    if (!response.ok) {
      throw new Error("강의 상세 정보를 불러오는데 실패했습니다.");
    }
    // console.log(await response.json());
    return await response.json();

    // 더미 데이터
    // return {
    //   curriculum: [
    //     {
    //       id: "chapter_1",
    //       title: "Chapter00. 들어가기 전",
    //       isExpanded: true,
    //       lessons: [
    //         {
    //           id: "lesson_1_1",
    //           title: "1. 연상과 구문",
    //           duration: "12:00",
    //           isCompleted: true,
    //         },
    //         {
    //           id: "lesson_1_2",
    //           title: "1. 연상과 구문",
    //           duration: "12:00",
    //           isCompleted: true,
    //         },
    //         {
    //           id: "lesson_1_3",
    //           title: "1. 연상과 구문",
    //           duration: "12:00",
    //           isCompleted: true,
    //         },
    //       ],
    //     },
    //     {
    //       id: "chapter_2",
    //       title: "Chapter00. 들어가기 전",
    //       isExpanded: true,
    //       lessons: [
    //         {
    //           id: "lesson_2_1",
    //           title: "1. 연상과 구문",
    //           duration: "12:00",
    //           isCompleted: true,
    //         },
    //         {
    //           id: "lesson_2_2",
    //           title: "1. 연상과 구문",
    //           duration: "12:00",
    //           isCompleted: true,
    //         },
    //         {
    //           id: "lesson_2_3",
    //           title: "1. 연상과 구문",
    //           duration: "12:00",
    //           isCompleted: false,
    //         },
    //         {
    //           id: "lesson_2_4",
    //           title: "1. 연상과 구문",
    //           duration: "12:00",
    //           isCompleted: false,
    //           isActive: true,
    //         },
    //         {
    //           id: "lesson_2_5",
    //           title: "1. 연상과 구문",
    //           duration: "12:00",
    //           isCompleted: false,
    //         },
    //         {
    //           id: "lesson_2_6",
    //           title: "1. 연상과 구문",
    //           duration: "12:00",
    //           isCompleted: false,
    //         },
    //       ],
    //     },
    //   ],
    //   enrollmentCount: 1247,
    //   rating: 4.8,
    // };
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
  setActiveLesson,
  resetCourseDetailState,
  clearError,
} = courseDetailSlice.actions;

export default courseDetailSlice.reducer;
