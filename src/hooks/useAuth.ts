import { useCallback } from "react";
import { useLogoutMutation } from "../auth/authApiSlice";
import { clearError, logout } from "../auth/authSlice";
import { useAppDispatch, useAppSelector } from "./hook";
import { persistor } from "../store/index";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(state => state.auth);
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = useCallback(async () => {
    try {
      console.log("🚪 로그아웃 시작");

      // API 로그아웃 호출
      if (authState.token || authState.refreshToken) {
        await logoutMutation({
          access: authState.token || undefined,
          refresh: authState.refreshToken || undefined,
        }).unwrap();
        console.log("✅ API 로그아웃 성공");
      }
    } catch (error) {
      console.error("❌ 로그아웃 API 오류:", error);
    } finally {
      // API 성공/실패 여부와 관계없이 로컬 상태 정리
      dispatch(logout());

      // persist 저장소에서도 auth 데이터 제거
      persistor.purge();

      alert("로그아웃 했습니다!");
      console.log("🎉 로그아웃 프로세스 완료");
    }
  }, [dispatch, logoutMutation, authState.token, authState.refreshToken]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    ...authState,
    handleLogout,
    clearAuthError,
    // hydration이 완료되었고 토큰이 유효할 때만 인증됨으로 간주
    isAuthenticated: authState.isHydrated && authState.isAuthenticated,
  };
};
