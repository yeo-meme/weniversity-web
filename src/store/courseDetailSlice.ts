import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  CourseDetailInfo,
  CourseDetailState,
  TabType,
} from "../types/courseDetail/courseDetail";

// 강의 상세 정보 가져오기
export const fetchCourseDetail = createAsyncThunk<CourseDetailInfo, string>(
  "courseDetail/fetchCourseDetail",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "강의 상세 정보를 불러오는데 실패했습니다."
      );
    }
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
    toggleChapterExpansion: (state, action: PayloadAction<number>) => {
      if (state.courseDetail?.chapters) {
        const chapter = state.courseDetail.chapters.find(
          c => c.chapter_id === action.payload
        );
        if (chapter) {
          chapter.isExpanded = !chapter.isExpanded;
        }
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
      });
  },
});

export const {
  setActiveTab,
  toggleChapterExpansion,
  resetCourseDetailState,
  clearError,
} = courseDetailSlice.actions;

export default courseDetailSlice.reducer;
