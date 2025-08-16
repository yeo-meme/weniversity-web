import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery.ts";
import type { UserData } from "./tokenService.ts";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access?: string;
  refresh?: string;
  email?: string;
  role?: string;
  success?: boolean;
  message?: string;
  data?: {
    token: string;
    user: {
      id: number;
      email: string;
      name: string;
    };
  };
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
  refresh?: string;
}

export interface LogoutRequest {
  access?: string;
  refresh?: string;
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
}

export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/users/login/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation<LogoutResponse, LogoutRequest>({
      query: (tokens) => ({
        url: "/users/logout/",
        method: "POST",
        body: tokens, // access와 refresh 토큰을 body로 전달
      }),
      invalidatesTags: ["Auth"],
    }),

    getProfile: builder.query<UserData, void>({
      query: () => "/users/profile/",
      providesTags: ["Auth"],
    }),

    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: (body) => ({
        url: "/users/refresh/",
        method: "POST",
        body,
      }),
    }),

    getProtectedData: builder.query<any, void>({
      query: () => "/protected-endpoint/",
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useRefreshTokenMutation,
  useGetProtectedDataQuery,
} = authApiSlice;
