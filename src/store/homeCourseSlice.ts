import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Course, ApiResponse } from "../types/course/course";

interface HomeCoursesState {
  boostCourses: Course[];
  vodCourses: Course[];
  boostLoading: boolean;
  vodLoading: boolean;
  boostError: string | null;
  vodError: string | null;
}

// VOD 강의 가져오기
export const fetchVodCourses = createAsyncThunk<ApiResponse>(
  "homeCourse/fetchVodCourses",
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = "/api/courses/";
      const queryParams = new URLSearchParams({
        page: "1",
        type: "vod", // VOD 필터
      });
      const url = `${baseUrl}?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "VOD 강의를 불러오는데 실패했습니다."
      );
    }
  }
);

// 부스트 커뮤니티 강의 가져오기
export const fetchBoostCourses = createAsyncThunk<ApiResponse>(
  "homeCourse/fetchBoostCourses",
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = "/api/courses/";
      const queryParams = new URLSearchParams({
        page: "1",
        type: "boost", // 부스트 커뮤니티 필터
      });
      const url = `${baseUrl}?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "부스트 커뮤니티 강의를 불러오는데 실패했습니다."
      );
    }
  }
);

const initialState: HomeCoursesState = {
  boostCourses: [],
  vodCourses: [],
  boostLoading: false,
  vodLoading: false,
  boostError: null,
  vodError: null,
};

const homeCourseSlice = createSlice({
  name: "homeCourse",
  initialState,
  reducers: {
    resetHomeCoursesState: state => {
      state.boostLoading = false;
      state.vodLoading = false;
      state.boostError = null;
      state.vodError = null;
    },
  },
  extraReducers: builder => {
    builder
      // 부스트 커뮤니티 강의
      .addCase(fetchBoostCourses.pending, state => {
        state.boostLoading = true;
        state.boostError = null;
      })
      .addCase(fetchBoostCourses.fulfilled, (state, action) => {
        state.boostLoading = false;
        const response = action.payload;
        const courses = response?.results || [];
        state.boostCourses = courses.slice(0, 3);
      })
      .addCase(fetchBoostCourses.rejected, (state, action) => {
        state.boostLoading = false;
        state.boostError =
          (action.payload as string) ||
          "부스트 커뮤니티 강의를 불러오는데 실패했습니다.";
        state.boostCourses = [];
      })
      // VOD 강의
      .addCase(fetchVodCourses.pending, state => {
        state.vodLoading = true;
        state.vodError = null;
      })
      .addCase(fetchVodCourses.fulfilled, (state, action) => {
        state.vodLoading = false;
        const response = action.payload;
        const courses = response?.results || [];
        state.vodCourses = courses.slice(0, 6);
      })
      .addCase(fetchVodCourses.rejected, (state, action) => {
        state.vodLoading = false;
        state.vodError =
          (action.payload as string) || "VOD 강의를 불러오는데 실패했습니다.";
        state.vodCourses = [];
      });
  },
});

export const { resetHomeCoursesState } = homeCourseSlice.actions;

export default homeCourseSlice.reducer;
