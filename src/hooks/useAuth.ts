import { useCallback } from "react";
import { useAppSelector, useAppDispatch } from "./redux-hooks";
import { logout, clearError } from "../auth/auth-slice";
import { useLogoutMutation } from "../auth/auth-api-slice";

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
  };
};
