import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/index";
import type {
  MyLecture,
  MyLectureState,
  MyLectureApiResponse,
  FetchMyLecturesParams,
} from "../types/myLectures/myLectures";

export interface EnrollCourseResponse {
  success: boolean;
  message: string;
  enrollment_id?: string;
  course_id: string;
}

// URL 파라미터 생성 함수
const buildMyLectureQueryParams = (params: FetchMyLecturesParams): string => {
  const queryParams = new URLSearchParams();

  // 페이지 파라미터
  const page = params.page || 1;
  queryParams.append("page", page.toString());

  // 유형 필터 (전체가 아닌 경우만)
  if (params.types && params.types.length > 0) {
    const apiTypes = params.types.map(type => {
      if (type === "VOD") return "vod";
      if (type === "부스트 커뮤니티") return "boost";
      return type;
    });
    queryParams.append("type", apiTypes.join(","));
  }

  // 상태 필터
  if (params.statuses && params.statuses.length > 0) {
    const apiStatuses = params.statuses.map(status => {
      if (status === "학습 가능") return "active";
      if (status === "종료") return "dropped";
      return status;
    });
    queryParams.append("status", apiStatuses.join(","));
  }

  return queryParams.toString();
};

// 내 강의 목록 가져오기
export const fetchMyLectures = createAsyncThunk<
  MyLectureApiResponse,
  FetchMyLecturesParams | undefined,
  { state: RootState }
>(
  "myLecture/fetchMyLectures",
  async (params, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        throw new Error("인증 토큰이 없습니다.");
      }

      const myLectureState = state.myLecture;
      const activeFilters = myLectureState?.activeFilters || {
        types: [],
        statuses: [],
      };

      const requestParams = params || {
        page: 1,
        types: activeFilters.types,
        statuses: activeFilters.statuses,
      };

      const baseUrl = "http://13.125.180.222/api/my-courses/";
      const queryString = buildMyLectureQueryParams(requestParams);
      const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
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
          : "내 강의 목록을 불러오는데 실패했습니다."
      );
    }
  }
);

const hasCourseIdAllPages = async (
  token: string,
  targetId: string
): Promise<boolean> => {
  let url = "http://13.125.180.222/api/my-courses/";

  while (url) {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("수강 목록을 불러오는데 실패했습니다.");
    }

    const data = await res.json();
    // 현재 페이지에서 찾으면 true 반환 → 바로 종료
    const found = data.results.some(
      (item: { course: { course_id: string } }) =>
        String(item.course.course_id) === targetId
    );

    if (found) return true;

    // 다음 페이지로 이동
    url = data.next;
  }

  return false;
};

// 수강 신청 API
export const enrollCourse = createAsyncThunk<
  EnrollCourseResponse,
  { courseId: string },
  { state: RootState }
>(
  "myLecture/enrollCourse",
  async ({ courseId }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        throw new Error("인증 토큰이 없습니다.");
      }

      // 중복 체크 (모든 페이지 탐색)
      const isExist = await hasCourseIdAllPages(token, courseId);
      if (isExist) {
        throw new Error("이미 수강신청했던 강의입니다.");
      }

      const response = await fetch(
        `http://13.125.180.222/api/courses/enroll/${courseId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message ||
          errorData.detail ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();

      return {
        success: true,
        message: data.message || "수강신청이 완료되었습니다.",
        enrollment_id: data.enrollment_id,
        course_id: courseId,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "수강신청에 실패했습니다."
      );
    }
  }
);

// 초기 상태
const initialState: MyLectureState = {
  myLectures: [],
  filters: {
    types: ["VOD", "부스트 커뮤니티"],
    statuses: ["학습 가능", "완료", "종료"],
  },
  activeFilters: {
    types: [],
    statuses: [],
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 9,
    totalItems: 0,
  },
  loading: false,
  error: null,
};

const myLectureSlice = createSlice({
  name: "myLecture",
  initialState,
  reducers: {
    resetMyLectureState: state => {
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
        filterType: keyof MyLectureState["activeFilters"];
        value: string;
      }>
    ) => {
      const { filterType, value } = action.payload;

      // "전체" 선택 시 필터 초기화
      if (value === "전체") {
        state.activeFilters[filterType] = [];
      } else {
        const currentFilters = state.activeFilters[filterType];
        let internalValue = value;

        if (filterType === "types") {
          if (value === "VOD") internalValue = "vod";
          else if (value === "부스트 커뮤니티") internalValue = "boost";
        } else if (filterType === "statuses") {
          if (value === "학습 가능") internalValue = "active";
          else if (value === "종료") internalValue = "dropped";
        }

        const index = currentFilters.indexOf(internalValue);
        if (index > -1) {
          currentFilters.splice(index, 1);
        } else {
          currentFilters.push(internalValue);
        }
      }

      state.pagination.currentPage = 1;
    },
    clearAllFilters: state => {
      state.activeFilters = {
        types: [],
        statuses: [],
      };
      state.pagination.currentPage = 1;
    },
    updateLectureStatus: (
      state,
      action: PayloadAction<{ lectureId: string; status: MyLecture["status"] }>
    ) => {
      const { lectureId, status } = action.payload;
      const lectureIndex = state.myLectures.findIndex(
        lecture => lecture.course.course_id.toString() === lectureId
      );

      if (lectureIndex !== -1) {
        state.myLectures[lectureIndex].status = status;
        if (status === "dropped") {
          state.myLectures[lectureIndex].isExpired = true;
        }
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMyLectures.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyLectures.fulfilled, (state, action) => {
        state.loading = false;

        const response = action.payload;
        const lectures = response?.results || [];

        state.myLectures = lectures.map(lecture => ({
          ...lecture,
          progressPercentage: parseFloat(lecture.progress) || 0,
          currentProgress: Math.floor(
            ((parseFloat(lecture.progress) || 0) / 100) * 15
          ),
          totalLessons: 15,
          tags: lecture.tags || [],
        }));

        state.pagination.totalItems = response?.count || 0;
      })
      .addCase(fetchMyLectures.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          "내 강의 목록을 불러오는데 실패했습니다.";
        state.myLectures = [];
      })

      // 수강신청
      .addCase(enrollCourse.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enrollCourse.fulfilled, state => {
        state.loading = false;
      })
      .addCase(enrollCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "수강신청에 실패했습니다.";
      });
  },
});

export const {
  resetMyLectureState,
  setActiveFilter,
  clearAllFilters,
  setCurrentPage,
  setItemsPerPage,
  updateLectureStatus,
} = myLectureSlice.actions;

export default myLectureSlice.reducer;
