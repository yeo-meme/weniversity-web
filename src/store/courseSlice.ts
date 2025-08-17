import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CourseState, ApiResponse } from "../types/course/course";
import type { RootState } from "../store/index";

interface FetchCoursesParams {
  page?: number;
  categories?: string[];
  types?: string[];
  levels?: string[];
  prices?: string[];
}

// 좋아요 토글 API
export const toggleCourseLike = createAsyncThunk<
  { course_id: string; is_liked: boolean },
  { courseId: string; isLiked: boolean },
  { state: RootState }
>(
  "course/toggleCourseLike",
  async ({ courseId, isLiked }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        throw new Error("인증 토큰이 없습니다.");
      }

      const response = await fetch(`/api/courses/${courseId}/like/`, {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return { course_id: data.course_id.toString(), is_liked: data.is_liked };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "좋아요 처리에 실패했습니다."
      );
    }
  }
);

// URL 파라미터 생성 함수
const buildQueryParams = (params: FetchCoursesParams): string => {
  const queryParams = new URLSearchParams();

  // 페이지 파라미터
  const page = params.page || 1;
  queryParams.append("page", page.toString());

  // 카테고리 필터 (전체가 아닌 경우만)
  if (
    params.categories &&
    params.categories.length > 0 &&
    !params.categories.includes("전체")
  ) {
    queryParams.append("category", params.categories.join(","));
  }

  // 유형 필터
  if (params.types && params.types.length > 0) {
    const apiTypes = params.types.map(type =>
      type === "VOD" ? "vod" : type === "부스트 커뮤니티" ? "boost" : type
    );
    queryParams.append("type", apiTypes.join(","));
  }

  // 난이도 필터
  if (params.levels && params.levels.length > 0) {
    queryParams.append("level", params.levels.join(","));
  }

  // 가격 필터
  if (params.prices && params.prices.length > 0) {
    const apiTypes = params.prices.map(price =>
      price === "무료" ? "free" : price === "유료" ? "paid" : "gov"
    );
    queryParams.append("price_type", apiTypes.join(","));
  }

  return queryParams.toString();
};

// 목록 가져오기
export const fetchCourses = createAsyncThunk<
  ApiResponse,
  FetchCoursesParams | undefined
>("course/fetchCourses", async (params, { getState, rejectWithValue }) => {
  try {
    const state = getState() as { course: CourseState };
    const { activeFilters } = state.course;
    const requestParams = params || {
      page: 1,
      categories: activeFilters.categories,
      types: activeFilters.types,
      levels: activeFilters.levels,
      prices: activeFilters.prices,
    };

    const baseUrl = "/api/courses/";
    const queryString = buildQueryParams(requestParams);
    const url = `${baseUrl}?${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log(await response.json());
    return await response.json();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : "코스 목록을 불러오는데 실패했습니다."
    );
  }
});

const initialState: CourseState = {
  courses: [],
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
  likedCourses: [],
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
      state.pagination.currentPage = 1;
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
          if (state.activeFilters.categories.includes("전체")) {
            state.activeFilters.categories = [value];
          } else {
            const index = state.activeFilters.categories.indexOf(value);
            if (index > -1) {
              state.activeFilters.categories.splice(index, 1);
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

      state.pagination.currentPage = 1;
    },
    clearAllFilters: state => {
      state.activeFilters = {
        categories: ["전체"],
        types: [],
        levels: [],
        prices: [],
      };
      state.pagination.currentPage = 1;
    },
    // 좋아요한 강의 목록 설정
    setLikedCourses: (state, action: PayloadAction<string[]>) => {
      state.likedCourses = action.payload;
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

        const response = action.payload;
        const courses = response?.results || [];

        state.courses = courses;
        state.pagination.totalItems = response?.count || 0;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "코스 목록을 불러오는데 실패했습니다.";
        state.courses = [];
      })
      // 좋아요 토글 처리
      .addCase(toggleCourseLike.fulfilled, (state, action) => {
        const { course_id, is_liked } = action.payload;

        if (is_liked) {
          if (!state.likedCourses.includes(course_id)) {
            state.likedCourses.push(course_id);
          }
        } else {
          state.likedCourses = state.likedCourses.filter(
            id => id !== course_id
          );
        }
      })
      .addCase(toggleCourseLike.rejected, (state, action) => {
        state.error =
          (action.payload as string) || "좋아요 처리에 실패했습니다.";
      });
  },
});

export const {
  resetCourseState,
  setActiveFilter,
  clearAllFilters,
  setCurrentPage,
  setItemsPerPage,
  setLikedCourses,
} = courseSlice.actions;

export default courseSlice.reducer;
