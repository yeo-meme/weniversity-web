import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../../auth/baseQuery";

// 코스 관련 타입 정의
export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  thumbnail?: string;
  duration?: number;
  level?: string;
  created_at: string;
  updated_at: string;
}

export interface CoursesResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Course[];
}

export interface CourseDetail extends Course {
  chapters: Array<{
    id: number;
    title: string;
    order: number;
    videos: Array<{
      id: number;
      title: string;
      order: number;
      duration: number;
      video_url: string;
    }>;
  }>;
}

// Courses API 슬라이스
export const coursesApiSlice = createApi({
  reducerPath: "coursesApi",
  baseQuery: baseQueryWithRefresh, // 토큰 갱신 기능 적용
  tagTypes: ['Course', 'CourseDetail'],
  endpoints: (builder) => ({
    // 전체 코스 목록 조회
    getCourses: builder.query<CoursesResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: '/courses/',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Course'],
    }),

    // 특정 코스 상세 조회
    getCourseDetail: builder.query<CourseDetail, number>({
      query: (courseId) => ({
        url: `/courses/${courseId}/`,
        method: 'GET',
      }),
      providesTags: (result, error, courseId) => [
        { type: 'CourseDetail', id: courseId },
      ],
    }),

    // 내 코스 목록 조회 (로그인 필요)
    getMyCourses: builder.query<CoursesResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: '/courses/my-courses/',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Course'],
    }),

    // 코스 등록/구매
    enrollCourse: builder.mutation<{ success: boolean; message: string }, number>({
      query: (courseId) => ({
        url: `/courses/${courseId}/enroll/`,
        method: 'POST',
      }),
      invalidatesTags: ['Course'],
    }),

    // 코스 검색
    searchCourses: builder.query<CoursesResponse, { 
      query: string; 
      page?: number; 
      limit?: number; 
    }>({
      query: ({ query, page = 1, limit = 10 }) => ({
        url: '/courses/search/',
        method: 'GET',
        params: { q: query, page, limit },
      }),
      providesTags: ['Course'],
    }),
  }),
});

// 자동 생성된 훅들 export
export const {
  useGetCoursesQuery,
  useGetCourseDetailQuery,
  useGetMyCoursesQuery,
  useEnrollCourseMutation,
  useSearchCoursesQuery,
  useLazyGetCoursesQuery,
  useLazyGetMyCoursesQuery,
} = coursesApiSlice;