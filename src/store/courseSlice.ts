import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Course, CourseState } from "../types/course";

// 코스 목록 가져오기
export const fetchCourses = createAsyncThunk<Course[]>(
  "course/fetchCourses",
  async () => {
    // 실제 API 호출로 대체 예정
    // const response = await fetch("http://13.125.180.222/api/courses/");
    // if (!response.ok) {
    //   throw new Error("코스 목록을 불러오는데 실패했습니다.");
    // }
    // return await response.json();
    // 더미 데이터
    return [
      {
        id: "1",
        title: "견고한 파이썬 부스트 커뮤니티 1기 (디스코드 커뮤니티)",
        instructor: "김여밈 강사님",
        instructorRole: "위니버 CPO",
        description:
          "파이썬 디어상 문자가 아닙니다! 커뮤니티에서 함께 소통하며 백엔드의 세계를 몸에 배자하고요.",
        image: "http://13.125.180.222/media/profiles/lion_XanRGlS.jpg",
        tags: ["부스트 커뮤니티", "백엔드", "초급", "무료"],
        category: "프론트엔드",
        level: "초급",
      },
      {
        id: "2",
        title: "견고한 파이썬 부스트 커뮤니티 1기 (디스코드 커뮤니티)",
        instructor: "김여밈 강사님",
        instructorRole: "위니버 CPO",
        description:
          "파이썬 디어상 문자가 아닙니다! 커뮤니티에서 함께 소통하며 백엔드의 세계를 몸에 배자하고요.",
        image: "http://13.125.180.222/media/profiles/lion_XanRGlS.jpg",
        tags: ["부스트 커뮤니티", "백엔드", "중급", "유료"],
        category: "백엔드",
        level: "중급",
      },
      {
        id: "3",
        title: "견고한 파이썬 부스트 커뮤니티 1기 (디스코드 커뮤니티)",
        instructor: "이혜민 강사님",
        instructorRole: "위니버 CPO",
        description:
          "파이썬 디어상 문자가 아닙니다! 커뮤니티에서 함께 소통하며 백엔드의 세계를 몸에 배자하고요.",
        image: "http://13.125.180.222/media/profiles/lion_XanRGlS.jpg",
        tags: ["부스트 커뮤니티", "AI", "초급", "국비지원"],
        category: "AI",
        level: "초급",
      },
      {
        id: "4",
        title: "견고한 리액트 부스트 커뮤니티 1기",
        instructor: "이혜민 강사님",
        instructorRole: "위니버 CTO",
        description: "리액트로 현대적인 웹 애플리케이션을 만들어보세요!",
        image: "http://13.125.180.222/media/profiles/lion_XanRGlS.jpg",
        tags: ["VOD", "프론트엔드", "중급", "유료"],
        category: "프론트엔드",
        level: "중급",
      },
      {
        id: "5",
        title: "AI 머신러닝 기초 과정",
        instructor: "최나영 강사님",
        instructorRole: "데이터 사이언티스트",
        description: "AI와 머신러닝의 기초부터 실무까지 배워보세요!",
        image: "http://13.125.180.222/media/profiles/lion_XanRGlS.jpg",
        tags: ["KDC", "AI", "실무", "국비지원"],
        category: "AI",
        level: "실무",
      },
      {
        id: "6",
        title: "풀스택 개발자 과정",
        instructor: "최나영 강사님",
        instructorRole: "시니어 개발자",
        description: "프론트엔드부터 백엔드까지 모든 것을 배우는 과정입니다!",
        image: "http://13.125.180.222/media/profiles/lion_XanRGlS.jpg",
        tags: ["VOD", "백엔드", "실무", "무료"],
        category: "백엔드",
        level: "실무",
      },
      // 더미 데이터 추가 (페이지네이션 테스트용)
      {
        id: "7",
        title: "Vue.js 완벽 가이드",
        instructor: "박개발 강사님",
        instructorRole: "프론트엔드 전문가",
        description: "Vue.js로 모던한 웹 애플리케이션을 개발해보세요!",
        image: "http://13.125.180.222/media/profiles/lion_XanRGlS.jpg",
        tags: ["VOD", "프론트엔드", "중급", "유료"],
        category: "프론트엔드",
        level: "중급",
      },
      {
        id: "8",
        title: "Node.js 백엔드 개발",
        instructor: "김백엔드 강사님",
        instructorRole: "백엔드 개발자",
        description: "Node.js로 강력한 백엔드 서버를 구축해보세요!",
        image: "http://13.125.180.222/media/profiles/lion_XanRGlS.jpg",
        tags: ["부스트 커뮤니티", "백엔드", "실무", "무료"],
        category: "백엔드",
        level: "실무",
      },
      {
        id: "9",
        title: "데이터 사이언스 입문",
        instructor: "이데이터 강사님",
        instructorRole: "데이터 분석가",
        description: "데이터 분석의 기초부터 실전까지!",
        image: "http://13.125.180.222/media/profiles/lion_XanRGlS.jpg",
        tags: ["KDC", "데이터 분석", "초급", "국비지원"],
        category: "데이터 분석",
        level: "초급",
      },
      {
        id: "10",
        title: "UI/UX 디자인 완성",
        instructor: "최디자인 강사님",
        instructorRole: "UX 디자이너",
        description: "사용자 중심의 디자인을 배워보세요!",
        image: "http://13.125.180.222/media/profiles/lion_XanRGlS.jpg",
        tags: ["VOD", "디자인", "중급", "유료"],
        category: "디자인",
        level: "중급",
      },
    ];
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
    subjects: ["VOD", "부스트 커뮤니티"],
    levels: ["초급", "중급", "실무"],
    formats: ["무료", "유료", "국비지원"],
    prices: [],
  },
  activeFilters: {
    categories: ["전체"],
    subjects: [],
    levels: [],
    formats: [],
    prices: [],
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 6,
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
        subjects: [],
        levels: [],
        formats: [],
        prices: [],
      };
      state.pagination.currentPage = 1;
      state.filteredCourses = state.courses;
      state.pagination.totalItems = state.courses.length;
    },
    applyFilters: state => {
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
      if (state.activeFilters.subjects.length > 0) {
        filtered = filtered.filter(course =>
          state.activeFilters.subjects.some(subject =>
            course.tags.includes(subject)
          )
        );
      }

      // 난이도 필터
      if (state.activeFilters.levels.length > 0) {
        filtered = filtered.filter(course =>
          state.activeFilters.levels.includes(course.level)
        );
      }

      // 가격 필터
      if (state.activeFilters.formats.length > 0) {
        filtered = filtered.filter(course =>
          state.activeFilters.formats.some(format =>
            course.tags.includes(format)
          )
        );
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
        state.courses = action.payload;
        state.filteredCourses = action.payload;
        state.pagination.totalItems = action.payload.length;
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
