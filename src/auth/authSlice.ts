import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { authApiSlice } from "./authApiSlice.ts";
import { TokenService } from "./token-service.ts";

interface User {
  id?: number;
  email: string;
  name?: string;
  role?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  tokenExpiration: number | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
  tokenExpiration: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      console.log("🔴 Persist: 로그아웃 → localStorage에서 auth 제거");
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = null;
      state.tokenExpiration = null;
    },

    clearError: (state) => {
      state.error = null;
    },

    setCredentials: (
      state,
      action: PayloadAction<{
        token: string;
        user: User;
        refreshToken?: string;
      }>
    ) => {
      console.log("🟢 Persist: 로그인 성공 → auth 상태 업데이트 및 저장 준비");
      console.log("📥 저장될 데이터:", action.payload);
      const { token, user, refreshToken } = action.payload;

      state.token = token;
      state.user = user;
      state.refreshToken = refreshToken || state.refreshToken;
      state.isAuthenticated = true;

      state.tokenExpiration = TokenService.getTokenExpiration(token);
    },

    updateToken: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken?: string;
      }>
    ) => {
      const { token, refreshToken } = action.payload;

      state.token = token;
      if (refreshToken) {
        state.refreshToken = refreshToken;
      }

      state.tokenExpiration = TokenService.getTokenExpiration(token);
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApiSlice.endpoints.login.matchPending, (state) => {
        console.log("✅ API 로그인 성공 → persist 저장 트리거");
        state.loading = true;
        state.error = null;
      })
      .addMatcher(
        authApiSlice.endpoints.login.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          const data = action.payload;

          if (data.access) {
            const user = {
              email: data.email || "",
              role: data.role,
            };

            authSlice.caseReducers.setCredentials(state, {
              type: "auth/setCredentials",
              payload: {
                token: data.access,
                user,
                refreshToken: data.refresh,
              },
            });
          } else if (data.success && data.data?.token) {
            const user = {
              id: data.data.user.id,
              email: data.data.user.email,
              name: data.data.user.name,
            };

            authSlice.caseReducers.setCredentials(state, {
              type: "auth/setCredentials",
              payload: {
                token: data.data.token,
                user,
              },
            });
          }
        }
      )
      .addMatcher(
        authApiSlice.endpoints.login.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error.message || "로그인에 실패했습니다.";
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
          state.tokenExpiration = null;
        }
      )
      .addMatcher(
        authApiSlice.endpoints.refreshToken.matchFulfilled,
        (state, action) => {
          const { access, refresh } = action.payload;

          authSlice.caseReducers.updateToken(state, {
            type: "auth/updateToken",
            payload: {
              token: access,
              refreshToken: refresh,
            },
          });
        }
      )
      .addMatcher(authApiSlice.endpoints.logout.matchFulfilled, (state) => {
        authSlice.caseReducers.logout(state);
      });
  },
});

export const { logout, clearError, setCredentials, updateToken } =
  authSlice.actions;
export default authSlice.reducer;
