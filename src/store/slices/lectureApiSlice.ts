import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  ApiLecturesResponse,
  LecturesResponse,
  LectureQueryParams,
} from "../../types/lecture";
import { transformApiLecture } from "../../types/lecture";

// 더미 데이터 (개발용)
const getMockData = (params: LectureQueryParams) => {
  const mockLectures = [
    {
      id: "1",
      title: "이건 첫 번째 레슨",
      thumbnail: "/src/assets/OG.png",
      tags: [
        { text: "부스트 커뮤니티", type: "type" as const },
        { text: "백엔드", type: "kind" as const },
        { text: "초급", type: "kind" as const },
      ],
      current_progress: 3,
      total_lessons: 15,
      progress_percentage: 20,
      status: "active" as const,
      type: "boost" as const,
      is_expired: false,
    },
    {
      id: "2",
      title: "좋은 건 너만 알기",
      thumbnail: "/src/assets/OG.png",
      tags: [
        { text: "VOD", type: "type" as const },
        { text: "프론트엔드", type: "kind" as const },
        { text: "중급", type: "kind" as const },
      ],
      current_progress: 8,
      total_lessons: 20,
      progress_percentage: 40,
      status: "active" as const,
      type: "vod" as const,
      is_expired: false,
    },
    {
      id: "3",
      title: "이제 두 번째 레슨",
      thumbnail: "/src/assets/OG.png",
      tags: [
        { text: "부스트 커뮤니티", type: "type" as const },
        { text: "풀스택", type: "kind" as const },
        { text: "고급", type: "kind" as const },
      ],
      current_progress: 12,
      total_lessons: 18,
      progress_percentage: 67,
      status: "completed" as const,
      type: "boost" as const,
      is_expired: true,
    },
    {
      id: "4",
      title: "슬픔도 너만 갖기",
      thumbnail: "/src/assets/OG.png",
      tags: [
        { text: "VOD", type: "type" as const },
        { text: "프론트엔드", type: "kind" as const },
        { text: "초급", type: "kind" as const },
      ],
      current_progress: 15,
      total_lessons: 25,
      progress_percentage: 60,
      status: "active" as const,
      type: "vod" as const,
      is_expired: true,
    },
    {
      id: "5",
      title: "드디어 세 번째 레슨",
      thumbnail: "/src/assets/OG.png",
      tags: [
        { text: "부스트 커뮤니티", type: "type" as const },
        { text: "컴퓨터 사이언스", type: "kind" as const },
        { text: "중급", type: "kind" as const },
      ],
      current_progress: 22,
      total_lessons: 30,
      progress_percentage: 73,
      status: "active" as const,
      type: "boost" as const,
      is_expired: false,
    },
    {
      id: "6",
      title: "일희일비 않기",
      thumbnail: "/src/assets/OG.png",
      tags: [
        { text: "VOD", type: "type" as const },
        { text: "백엔드", type: "kind" as const },
        { text: "중급", type: "kind" as const },
      ],
      current_progress: 16,
      total_lessons: 16,
      progress_percentage: 100,
      status: "completed" as const,
      type: "vod" as const,
      is_expired: false,
    },
  ];

  // 필터링
  let filtered = mockLectures;

  if (params.type) {
    filtered = filtered.filter((lecture) => lecture.type === params.type);
  }

  if (params.status) {
    if (params.status === "available") {
      filtered = filtered.filter((lecture) => !lecture.is_expired);
    } else if (params.status === "expired") {
      filtered = filtered.filter((lecture) => lecture.is_expired);
    } else {
      filtered = filtered.filter((lecture) => lecture.status === params.status);
    }
  }

  return {
    count: filtered.length,
    next: null,
    previous: null,
    results: filtered,
  };
};

export const lectureApiSlice = createApi({
  reducerPath: "lectureApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Lecture"],
  endpoints: (builder) => ({
    getMyLectures: builder.query<LecturesResponse, LectureQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params?.type) {
          searchParams.append("type", params.type);
        }

        if (params?.status) {
          searchParams.append("status", params.status);
        }

        if (params?.page) {
          searchParams.append("page", params.page.toString());
        }

        if (params?.limit) {
          searchParams.append("limit", params.limit.toString());
        }

        const queryString = searchParams.toString();
        return `my-courses/${queryString ? `?${queryString}` : ""}`;
      },
      transformResponse: (
        response: ApiLecturesResponse,
        _meta,
        arg: LectureQueryParams
      ): LecturesResponse => {
        if (response?.results && response.results.length > 0) {
          return {
            count: response.count,
            next: response.next,
            previous: response.previous,
            results: response.results.map(transformApiLecture),
          };
        }

        return getMockData(arg || {});
      },
      providesTags: ["Lecture"],
    }),
  }),
});

export const { useGetMyLecturesQuery } = lectureApiSlice;
