// slices/lectureApiSlice.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "../../auth/baseQuery";

// 🔥 서버 응답 구조에 맞춘 타입 정의
export interface Instructor {
  id: number;
  name: string;
  profile?: string;
}

export interface LectureItem {
  id: number;
  title: string;
  order: number;
  duration?: number; // 선택적
  videos?: Array<{
    id: number;
    title: string;
    order: number;
    duration: number;
    video_url: string;
  }>;
}

export interface Lecture {
  course_id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;
  price_type: string;
  type: string;
  code: number;
  code_str: string;
  course_image: string;
  course_time: string;
  course_duedate: string;
  created_at: string;
  is_active: boolean;
  order_index: number;
  discord_url: string | null;
  chapters: LectureItem[];
  instructors: Instructor[];
  liked_by: any[];
  students: any[];
}

export interface LectureResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Lecture[];
}

// 🔥 UI 컴포넌트에서 사용할 Lecture 타입 (기존 구조 유지)
export interface UILecture {
  id: number;
  title: string;
  time: string;        // "0:00"
  duration: string;    // "5:00"
  durationSeconds: number;
  videoFile: string;
  completed: boolean;
}

// Lectures API 슬라이스
export const lectureApiSlice = createApi({
  reducerPath: "lectureApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ['Lecture', 'LectureDetail'],
  endpoints: (builder) => ({
    // 전체 강의 목록 조회
    getLectures: builder.query<LectureResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: '/courses/',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Lecture'],
    }),

    // 특정 강의 상세 조회
    getLectureDetail: builder.query<Lecture, number>({
      query: (lectureId) => ({
        url: `/courses/${lectureId}/`,
        method: 'GET',
      }),
      providesTags: (result, error, lectureId) => [
        { type: 'LectureDetail', id: lectureId },
      ],
    }),

    // 내 강의 목록 조회 (로그인 필요)
    getMyLectures: builder.query<LectureResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: '/courses/my-courses/',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Lecture'],
    }),

    // 강의 등록/구매
    enrollLecture: builder.mutation<{ success: boolean; message: string }, number>({
      query: (lectureId) => ({
        url: `/courses/${lectureId}/enroll/`,
        method: 'POST',
      }),
      invalidatesTags: ['Lecture'],
    }),

    // 강의 검색
    searchLectures: builder.query<LectureResponse, {
      query: string;
      page?: number;
      limit?: number;
    }>({
      query: ({ query, page = 1, limit = 10 }) => ({
        url: '/courses/search/',
        method: 'GET',
        params: { q: query, page, limit },
      }),
      providesTags: ['Lecture'],
    }),
  }),
});

// 자동 생성된 훅들 export
export const {
  useGetLecturesQuery,
  useGetLectureDetailQuery,
  useGetMyLecturesQuery,
  useEnrollLectureMutation,
  useSearchLecturesQuery,
  useLazyGetLecturesQuery,
  useLazyGetMyLecturesQuery,
} = lectureApiSlice;

// 🔥 서버 데이터를 UI 컴포넌트용으로 변환하는 유틸리티 함수
export const transformLectureToUILectures = (lecture: Lecture): UILecture[] => {
  if (!lecture.chapters || lecture.chapters.length === 0) {
    return [];
  }

  let cumulativeTime = 0; // 누적 시간 (초)

  return lecture.chapters.map((lectureItem, index) => {
    const startTime = cumulativeTime;
    const lectureDuration = lectureItem.duration || 300; // 기본 5분(300초)
    cumulativeTime += lectureDuration;

    return {
      id: lectureItem.id,
      title: lectureItem.title,
      time: formatSecondsToTime(startTime), // "0:00", "5:00" 형식
      duration: formatSecondsToTime(lectureDuration), // "5:00" 형식
      durationSeconds: lectureDuration,
      videoFile: lectureItem.videos?.[0]?.video_url || `video${lectureItem.id}.mp4`,
      completed: false, // 기본값
    };
  });
};

// 🔥 초를 "분:초" 형식으로 변환하는 헬퍼 함수
export const formatSecondsToTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};