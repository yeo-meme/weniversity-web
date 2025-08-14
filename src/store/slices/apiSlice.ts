import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "./baseQuery";
// import type { RootState } from "../store/store";
// import { updateAccessToken, logout } from "../auth/authSlice";


// const baseQuery = fetchBaseQuery({
//   baseUrl: "/api",
//   prepareHeaders: (headers, { getState }) => {
//     const token = (getState() as RootState).auth.accessToken;
//     if (token) {
//       headers.set("Authorization", `Bearer ${token}`);
//       console.log("🔑 API 요청에 토큰 첨부:", token.substring(0, 20) + "...");
//     } else {
//       console.log("⚠️ API 요청 시 토큰 없음");
//     }
//     return headers;
//   },
// });

// // 401 시 리프레시만 처리하는 로직
// const baseQueryWithRefresh = async (args: any, api: any, extraOptions: any) => {
//   // 첫 번째 요청
//   let result = await baseQuery(args, api, extraOptions);

//   // 401 에러 시에만 리프레시 처리
//   if (result.error && result.error.status === 401) {
//     console.log("🚨 401 오류 발생 - 토큰 갱신 필요");
    
//     const state = api.getState() as RootState;
//     const refreshToken = state.auth.refreshToken;

//     if (!refreshToken) {
//       console.log("❌ 리프레시 토큰 없음 - 로그아웃 처리");
//       api.dispatch(logout());
//       return result;
//     }

//     console.log("🔄 액세스 토큰 갱신 시도...");

//     // 리프레시 토큰으로 새 액세스 토큰 요청
//     const refreshResult = await baseQuery(
//       {
//         url: "/users/refresh/",
//         method: "POST",
//         body: { refresh: refreshToken },
//       },
//       api,
//       extraOptions
//     );

//     if (refreshResult.data && 'access' in refreshResult.data) {
//       const newAccessToken = refreshResult.data.access as string;
//       console.log("✅ 액세스 토큰 갱신 성공");

//       // Redux store의 액세스 토큰 업데이트
//       api.dispatch(updateAccessToken(newAccessToken));

//       console.log("🔄 원래 요청 재시도 중...");
//       // 새 토큰으로 원래 요청 재시도
//       result = await baseQuery(args, api, extraOptions);
//       console.log("✅ 재시도 요청 완료");
//     } else {
//       console.log("❌ 토큰 갱신 실패 - 로그아웃 처리");
//       api.dispatch(logout());
//     }
//   }

//   return result;
// };

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

     // ✨ 코스 엔드포인트 추가
  //    getCourses: builder.query<
  //    any[], 
  //    void   
  //  >({
  //    query: () => ({
  //      url: '/courses/',
  //      method: 'GET',
  //    }),
  //    providesTags: ['Course'],
  //  }),
  }),
});

export const { useRefreshTokenMutation } = authApiSlice;
