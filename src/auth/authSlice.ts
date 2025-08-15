import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { authApiSlice } from "./authApiSlice.ts";
import { TokenService } from "./token-service.ts";
import type { RootState } from "../store/store.ts";

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
      const { token, user, refreshToken } = action.payload;

      state.token = token;
      state.user = user;
      state.refreshToken = refreshToken || state.refreshToken;
      state.isAuthenticated = !!(action.payload.user?.email && action.payload.token);;
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
      .addMatcher(authApiSlice.endpoints.logout.matchFulfilled, (state) => {
        authSlice.caseReducers.logout(state);
      })
      .addMatcher(
        (action) => action.type === "persist/REHYDRATE" && action.key === "auth",
        (state) => {
          state.isHydrated = true;
          console.log("✅ persist/REHYDRATE 완료: auth 상태 복원됨");
        }
      )
      .addMatcher(
        (action) => action.type === "persist/REHYDRATE" && action.key === "auth",
        (state) => {
          state.isHydrated = true;
          state.isAuthenticated = !!(state.user?.email && state.token);
          console.log("✅ persist/REHYDRATE 완료");
          console.log("📧 이메일:", state.user?.email);
          console.log("🎫 토큰:", state.token);
          console.log("🔓 인증 상태:", state.isAuthenticated);
        }
      )
  },
});

export const { logout, clearError, setCredentials, updateToken } =
  authSlice.actions;
export default authSlice.reducer;


export const selectIsAuthenticated = (state: RootState) => {
  return !!(state.auth.user?.email && state.auth.token);
};

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
