import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { authApiSlice } from "./authApiSlice.ts";
import { TokenService } from "./tokenService.ts";
import { REHYDRATE } from "redux-persist";

interface User {
  id?: number | null;
  email: string;
  name?: string | null;
  role?: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  isHydrated: boolean;
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
  isHydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: state => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = null;
      state.tokenExpiration = null;
    },

    clearError: state => {
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
      const { token, user, refreshToken } = action.payload;
      state.token = token;
      state.user = user;
      state.refreshToken = refreshToken || state.refreshToken;
      state.isAuthenticated = !!(
        action.payload.user?.email && action.payload.token
      );
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

    // 토큰 유효성 검사 및 정리
    validateTokenOnRehydrate: state => {
      if (state.token && !TokenService.isTokenValid(state.token)) {
        console.log("🚨 저장된 토큰이 만료되었습니다. 상태를 초기화합니다.");
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.tokenExpiration = null;
      } else if (state.token && state.user?.email) {
        state.isAuthenticated = true;
        console.log("✅ 유효한 토큰으로 로그인 상태 복원됨");
      }
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(authApiSlice.endpoints.login.matchPending, state => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(
        authApiSlice.endpoints.login.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          const data: any = action.payload;

          if (data.access) {
            console.log("🔑 Case 1: access 토큰 방식");
            console.log("📧 email:", data.email);
            console.log("🎯 role:", data.role);

            const user = {
              id: null,
              email: data.email || "",
              name: null,
              role: data.role || null,
            };

            console.log("👤 생성된 user:", user);

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
              role: data.data.user.role || null,
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
      .addMatcher(authApiSlice.endpoints.logout.matchFulfilled, state => {
        authSlice.caseReducers.logout(state);
      })
      .addMatcher(
        (action): action is any => action.type === REHYDRATE,
        (state, action) => {
          if (action.key === "auth" && action.payload) {
            const persistedState = action.payload.auth;

            // 기본적으로 hydrated 상태로 설정
            state.isHydrated = true;

            console.log("🔄 Redux Persist: auth 상태 복원 중...");
            console.log("📦 복원된 데이터:", persistedState);

            // 토큰이 있다면 유효성 검사
            if (persistedState?.token) {
              if (TokenService.isTokenValid(persistedState.token)) {
                console.log("✅ 유효한 토큰 발견 - 로그인 상태 유지");
                state.isAuthenticated = true;
                state.user = persistedState.user;
                state.token = persistedState.token;
                state.refreshToken = persistedState.refreshToken;
                state.tokenExpiration = persistedState.tokenExpiration;
              } else {
                console.log("❌ 만료된 토큰 발견 - 로그아웃 상태로 설정");
                // 만료된 토큰은 제거
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.refreshToken = null;
                state.tokenExpiration = null;
              }
            }
          }
        }
      );
  },
});

export const {
  logout,
  clearError,
  setCredentials,
  updateToken,
  validateTokenOnRehydrate,
} = authSlice.actions;
export default authSlice.reducer;
