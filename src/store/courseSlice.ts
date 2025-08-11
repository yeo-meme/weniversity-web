import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CourseState, ApiResponse } from "../types/course";

// 코스 목록 가져오기
export const fetchCourses = createAsyncThunk<ApiResponse>(
  "course/fetchCourses",
  async () => {
    const response = await fetch("http://13.125.180.222/api/courses/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("코스 목록을 불러오는데 실패했습니다.");
    }

    return await response.json();
  }
);

const initialState: CourseState = {
  courses: [],
  filteredCourses: [],
  filters: {
    categories: [
      "전체",
      "프론트엔드",
      "백엔드",
      "데이터 분석",
      "AI",
      "디자인",
      "기타",
    ],
    types: ["VOD", "부스트 커뮤니티"],
    levels: ["초급", "중급", "실무"],
    prices: ["무료", "유료", "국비지원"],
  },
  activeFilters: {
    categories: ["전체"],
    types: [],
    levels: [],
    prices: [],
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 9,
    totalItems: 0,
  },
  loading: false,
  error: null,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    resetCourseState: state => {
      state.loading = false;
      state.error = null;
      state.pagination.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.itemsPerPage = action.payload;
      state.pagination.currentPage = 1; // 페이지당 아이템 수가 변경되면 첫 페이지로 이동
    },
    setActiveFilter: (
      state,
      action: PayloadAction<{
        filterType: keyof CourseState["activeFilters"];
        value: string;
      }>
    ) => {
      const { filterType, value } = action.payload;

      if (filterType === "categories") {
        if (value === "전체") {
          state.activeFilters.categories = ["전체"];
        } else {
          // '전체'가 선택되어 있다면 제거하고 새로운 값 추가
          if (state.activeFilters.categories.includes("전체")) {
            state.activeFilters.categories = [value];
          } else {
            // 이미 선택된 값이면 제거, 아니면 추가
            const index = state.activeFilters.categories.indexOf(value);
            if (index > -1) {
              state.activeFilters.categories.splice(index, 1);
              // 아무것도 선택되지 않았다면 '전체' 선택
              if (state.activeFilters.categories.length === 0) {
                state.activeFilters.categories = ["전체"];
              }
            } else {
              state.activeFilters.categories.push(value);
            }
          }
        }
      } else {
        const currentFilters = state.activeFilters[filterType];
        const index = currentFilters.indexOf(value);
        if (index > -1) {
          currentFilters.splice(index, 1);
        } else {
          currentFilters.push(value);
        }
      }

      // 필터가 변경되면 첫 페이지로 이동
      state.pagination.currentPage = 1;

      // 필터 적용
      courseSlice.caseReducers.applyFilters(state);
    },
    clearAllFilters: state => {
      state.activeFilters = {
        categories: ["전체"],
        types: [],
        levels: [],
        prices: [],
      };
      state.pagination.currentPage = 1;
      state.filteredCourses = Array.isArray(state.courses) ? state.courses : [];
      state.pagination.totalItems = Array.isArray(state.courses)
        ? state.courses.length
        : 0;
    },
    applyFilters: state => {
      if (!Array.isArray(state.courses)) {
        state.filteredCourses = [];
        state.pagination.totalItems = 0;
        return;
      }

      let filtered = state.courses;

      // 카테고리 필터
      if (
        !state.activeFilters.categories.includes("전체") &&
        state.activeFilters.categories.length > 0
      ) {
        filtered = filtered.filter(course =>
          state.activeFilters.categories.includes(course.category)
        );
      }

      // 유형 필터
      if (state.activeFilters.types.length > 0) {
        filtered = filtered.filter(course => {
          const courseTypeLabel =
            course.type === "vod" ? "VOD" : "부스트 커뮤니티";
          return state.activeFilters.types.includes(courseTypeLabel);
        });
      }

      // 난이도 필터
      if (state.activeFilters.levels.length > 0) {
        filtered = filtered.filter(course =>
          state.activeFilters.levels.includes(course.level)
        );
      }

      // 가격 필터
      if (state.activeFilters.prices.length > 0) {
        filtered = filtered.filter(course => {
          let priceLabel = "";
          if (course.price === undefined) priceLabel = "정보없음";
          else if (course.price === -1) priceLabel = "국비지원";
          else if (course.price === 0) priceLabel = "무료";
          else if (course.price > 0) priceLabel = "유료";
          else priceLabel = "정보없음";

          return state.activeFilters.prices.includes(priceLabel);
        });
      }

      state.filteredCourses = filtered;
      state.pagination.totalItems = filtered.length;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCourses.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;

        const courses = action.payload?.results || [];

        state.courses = courses;
        state.filteredCourses = courses;
        state.pagination.totalItems = courses.length;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "코스 목록을 불러오는데 실패했습니다.";
      });
  },
});

export const {
  resetCourseState,
  setActiveFilter,
  clearAllFilters,
  setCurrentPage,
  setItemsPerPage,
} = courseSlice.actions;
export default courseSlice.reducer;
