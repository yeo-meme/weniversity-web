import { useCallback } from "react";
import { useLogoutMutation } from "../auth/authApiSlice";
import { clearError, logout, updateUser } from "../auth/authSlice";
import { useAppDispatch, useAppSelector } from "./hook";
import { persistor } from "../store/index";
import { fetchLikedCourses } from "../store/myPageSlice";
import { setLikedCourses } from "../store/courseSlice";

interface User {
  id?: number | null;
  email: string;
  name?: string | null;
  role?: string | null;
  profile_image_url?: string;
}

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(state => state.auth);
  const [logoutMutation] = useLogoutMutation();

  // 사용자 정보 부분 업데이트
  const updateUserInfo = useCallback(
    (updates: Partial<User>) => {
      dispatch(updateUser(updates));
    },
    [dispatch]
  );

  // 좋아요한 강의 목록 로드
  const loadLikedCourses = useCallback(async () => {
    if (authState.isAuthenticated && authState.token) {
      try {
        const likedCoursesResponse = await dispatch(
          fetchLikedCourses()
        ).unwrap();
        const likedCourseIds = likedCoursesResponse.results.map(
          (item: { course: { course_id: number } }) =>
            item.course.course_id.toString()
        );
        dispatch(setLikedCourses(likedCourseIds));
      } catch (error) {
        console.error("좋아요한 강의 목록 로드 실패:", error);
      }
    }
  }, [dispatch, authState.isAuthenticated, authState.token]);

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

      // 좋아요 상태 초기화
      dispatch(setLikedCourses([]));

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
    loadLikedCourses,
    updateUserInfo,
    // 토큰이 유효할 때만 인증됨으로 간주
    isAuthenticated: authState.isHydrated && authState.isAuthenticated,
  };
};
