let accessToken: string | null = null;

//토큰 저장/갱신 helper
export const TokenService = {
  getAccessToken: () => accessToken ?? localStorage.getItem("access_token"),
  setAccessToken: (token: string) => {
    accessToken = token;
    localStorage.setItem("access_token", token);
  },
  removeTokens: () => {
    accessToken = null;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_role");
  },
  isLoggedIn: () => {
    const token = TokenService.getAccessToken();
    const user = TokenService.getUser();
    return !!(token && user?.email);
  },
  getRefreshToken: () => localStorage.getItem("refresh_token"),
  setRefreshToken: (token: string) => {
    try {
      localStorage.setItem("refresh_token", token);
      console.log("✅ 리프레시 토큰 저장 완료");
    } catch (error) {
      console.error("리프레시 토큰 저장 실패:", error);
    }
  },
  getUser: () => {
    try {
      const email = localStorage.getItem("user_email");
      const role = localStorage.getItem("user_role");
      
      if (!email) return null;
      
      return {
        email,
        role: role || undefined, // role이 없으면 undefined
      };
    } catch (error) {
      console.error("사용자 정보 읽기 실패:", error);
      return null;
    }
  },
  setUser: (email: string, role?: string) => {
    try {
      localStorage.setItem("user_email", email);
      if (role) {
        localStorage.setItem("user_role", role);
      } else {
        localStorage.removeItem("user_role"); // role이 없으면 제거
      }
    } catch (error) {
      console.error("사용자 정보 저장 실패:", error);
    }
  },
};
