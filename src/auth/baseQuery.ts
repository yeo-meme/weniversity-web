import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { RootState } from "../store/index";

export const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.log("액세스 토큰이 만료되었습니다. 갱신을 시도합니다...");

    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken;

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/users/refresh/",
          method: "POST",
          body: { refresh: refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { access, refresh } = refreshResult.data as {
          access: string;
          refresh?: string;
        };

        console.log("액세스 토큰 갱신 성공");

        api.dispatch({
          type: "auth/setCredentials",
          payload: {
            token: access,
            refreshToken: refresh || refreshToken,
            user: state.auth.user,
          },
        });

        result = await baseQuery(args, api, extraOptions);
      } else {
        console.log("리프레시 토큰이 만료되었습니다. 로그아웃합니다...");
        api.dispatch({ type: "auth/logout" });
      }
    } else {
      console.log("리프레시 토큰이 없습니다. 로그아웃합니다...");
      api.dispatch({ type: "auth/logout" });
    }
  }

  return result;
};
