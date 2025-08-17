import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

// Mission 제출을 위한 요청 데이터 타입
export interface SubmitMissionRequest {
  problem_id: number;
  title: string;
  user_code: string;
  is_correct: boolean;
  message: string;
}

// Mission 제출/조회 응답 데이터 타입
export interface MissionResult {
  problem_id: number;
  title: string;
  user_code: string;
  is_correct: boolean;
  message: string;
  submitted_at: string; // ISO string
}

export interface MissionStatistics {
  total_submitted: number;
  solved_count: number;
  skipped_count: number;
  accuracy: number;
}

export const missionApiSlice = createApi({
  reducerPath: "missionApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Mission"], // 캐싱 및 무효화를 위한 태그
  endpoints: (builder) => ({
    submitMission: builder.mutation<MissionResult, SubmitMissionRequest>({
      query: (missionData) => ({
        url: "/missions/submit/", // 절대 URL 사용
        method: "POST",
        body: missionData,
      }),
      // 성공 시 관련 캐시 무효화
      invalidatesTags: ["Mission"],
    }),
    getMissionResults: builder.query<MissionResult[], void>({
      query: () => "/missions/results/", // 절대 URL 사용
      providesTags: ["Mission"],
    }),
    getMissionStatistics: builder.query<MissionStatistics, void>({
      query: () => "/missions/statistics/", // 절대 URL 사용
      providesTags: ["Mission"],
    }),
  }),
});

export const {
  useSubmitMissionMutation,
  useGetMissionResultsQuery,
  useGetMissionStatisticsQuery,
} = missionApiSlice;