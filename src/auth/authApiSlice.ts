import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "./baseQuery";

// 최소한의 API 슬라이스 (리프레시 기능만)
export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithRefresh, // 토큰 갱신 기능 적용
  tagTypes: ['Course', 'User'],
  endpoints: (builder) => ({
    refreshToken: builder.mutation<
      { access: string },
      { refresh: string }
    >({
      query: (refreshData) => ({
        url: '/users/refresh/',
        method: 'POST',
        body: refreshData,
      }),
    }),

  }),
});

export const { useRefreshTokenMutation } = authApiSlice;
