import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { TokenService } from "../auth/tokenService";

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    user: { email: string; role?: string } | null;
    isLoading: boolean;
    tokenExpiryTime: number | null; // 토큰 만료 시간 추가
  }
  
  const initialState: AuthState = {
    accessToken: null,
    refreshToken: null,
    user: null,
    isLoading: false,
    tokenExpiryTime: null,
  };
  
  const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      setCredentials: (
        state,
        action: PayloadAction<{
          accessToken: string;
          refreshToken: string;
          user: { email: string; role?: string };
        }>
      ) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
  
        // JWT 토큰 만료 시간 파싱
        try {
          const payload = JSON.parse(atob(action.payload.accessToken.split('.')[1]));
          state.tokenExpiryTime = payload.exp * 1000; // 밀리초로 변환
          
          console.log("🔑 토큰 설정 완료:", {
            user: action.payload.user.email,
            expiryTime: new Date(state.tokenExpiryTime).toISOString(),
            remainingTime: `${Math.round((state.tokenExpiryTime - Date.now()) / 1000)}초`
          });
        } catch (error) {
          console.error("❌ 토큰 만료 시간 파싱 실패:", error);
        }
  
        // TokenService에도 저장 (동기화)
        TokenService.setAccessToken(action.payload.accessToken);
        TokenService.setRefreshToken(action.payload.refreshToken);
        TokenService.setUser(action.payload.user.email, action.payload.user.role);
      },
      
      updateAccessToken: (state, action: PayloadAction<string>) => {
        const oldToken = state.accessToken;
        state.accessToken = action.payload;
        
        // 새 토큰 만료 시간 파싱
        try {
          const payload = JSON.parse(atob(action.payload.split('.')[1]));
          state.tokenExpiryTime = payload.exp * 1000;
          
          console.log("🔄 토큰 업데이트 완료:", {
            oldTokenPreview: oldToken?.substring(0, 20) + "...",
            newTokenPreview: action.payload.substring(0, 20) + "...",
            newExpiryTime: new Date(state.tokenExpiryTime).toISOString(),
            remainingTime: `${Math.round((state.tokenExpiryTime - Date.now()) / 1000)}초`
          });
        } catch (error) {
          console.error("❌ 새 토큰 만료 시간 파싱 실패:", error);
        }
        
        TokenService.setAccessToken(action.payload);
      },
      
      logout: (state) => {
        console.log("🚪 로그아웃 처리 중...");
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        state.tokenExpiryTime = null;
        TokenService.removeTokens();
        console.log("✅ 로그아웃 완료");
      },
      
      setLoading: (state, action: PayloadAction<boolean>) => {
        state.isLoading = action.payload;
        console.log("⏳ 로딩 상태:", action.payload ? "시작" : "완료");
      },
    },
  });
  
  export const { setCredentials, updateAccessToken, logout, setLoading } = authSlice.actions;
  export default authSlice.reducer;
  