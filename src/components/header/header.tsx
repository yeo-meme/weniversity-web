import React, { useState } from "react";
import { useAppSelector } from "../../hooks/hook.ts";
import { useLogoutMutation,useLoginMutation } from "../../auth/authApiSlice.ts";
import logoImg from "../../assets/logo.png";
import searchIcon from "../../assets/icon-search.png";
import hamburgerIcon from "../../assets/icon-hamburger.png";
import UserProfile from "./user-profile.tsx";
import MobileMenu from "./mobile-menu.tsx";
import { resetAuth } from "../../auth/authSlice.ts";
import { useAppDispatch } from "../../hooks/hook.ts";
import { useNavigate } from "react-router-dom"; 

// interface HeaderProps {
//   isLoggedIn: boolean;
//   onLogin?: () => void;
//   onLogout?: () => void;
//   onGoToMain?: () => void;
// }

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isAuthenticated, user, token, refreshToken } = useAppSelector(
    (state) => state.auth
  );

  // const isActuallyLoggedIn = isAuthenticated && 
  //                         !!user?.email && 
  //                         !!token && 
  //                         token !== "null";

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 검색 로직 구현
  };

  // const handleLogin = () => {
  //   if (onLogin) {
  //     onLogin();
  //   }
  // };

  // const handleLogin = async (credentials: { email: string; password: string }) => {
  //   try {
  //     // 로그인 API 호출
  //     const result = await loginMutation(credentials).unwrap();
      
  //     console.log("로그인 API 응답:", result);
      
  //     // 로그인 성공 콜백 실행
  //     // if (onLogin) {
  //     //   onLogin();
  //     // }
      
  //   } catch (error) {
  //     console.error("로그인 오류:", error);
  //   }
  // };

  // const handleLogout = async () => {
  //   try {
  //     console.log("🚪 로그아웃 시작 - 토큰 확인:", {
  //       accessToken: token ? "있음" : "없음",
  //       refreshToken: refreshToken ? "있음" : "없음",
  //     });

  //     const result = await logoutMutation({
  //       access: token || undefined,
  //       refresh: refreshToken || undefined,
  //     }).unwrap();

  //     localStorage.removeItem('persist:auth');
  //     console.log("✅ API 로그아웃 성공:", result);
  //   } catch (error) {
  //     console.error("❌ 로그아웃 API 오류:", error);
  //   }

  //       // persistor 초기화
  //       dispatch(resetAuth());

  //   // if (onLogout) {
  //   //   onLogout();
  //   //   console.log("🔄 로컬 로그아웃 콜백 실행 완료");
  //   // }

  //   console.log("🎉 로그아웃 프로세스 완료");
  //   alert("로그아웃 되었습니다.");
  // };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="border-b border-gray200">
        <div className="flex items-center min-[835px]:justify-center min-[835px]:h-[70px] min-[835px]:px-4 max-[834px]:justify-between max-[834px]:w-full max-[834px]:h-14 max-[834px]:px-4 max-w-[1190px] max-[834px]:max-w-[calc(100%-32px)] mx-auto">
          <div className="min-[835px]:flex min-[835px]:items-center min-[835px]:w-full min-[835px]:justify-between max-[834px]:contents">
            <h1 className="min-[835px]:flex-shrink-0 min-[835px]:w-34 md:w-36 lg:w-40 xl:w-[202px]">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
              >
                <img
                  src={logoImg}
                  alt="logo"
                  className="min-[835px]:w-full max-[834px]:w-40"
                />
              </a>
            </h1>

            <div className="min-[835px]:flex min-[835px]:items-center min-[835px]:gap-4 md:gap-6 lg:gap-8 xl:gap-10 max-[834px]:hidden">
              <nav>
                <ul className="flex gap-4 md:gap-6 lg:gap-8 xl:gap-10 list-none whitespace-nowrap">
                  <li>
                    <a
                      href="#"
                      className="text-main-text no-underline text-sm lg:text-base"
                    >
                      위니버시티 소개
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-main-text no-underline text-sm lg:text-base"
                    >
                      수강생 이야기
                    </a>
                  </li>
                </ul>
              </nav>

              <div className="flex gap-3 md:gap-4 lg:gap-5 flex-shrink-0">
                <form
                  role="search"
                  className="relative"
                  onSubmit={handleSearch}
                >
                  <input
                    type="search"
                    placeholder="검색어를 입력하세요"
                    className="w-48 md:w-56 lg:w-64 xl:w-80 h-[42px] py-2.5 pl-5 pr-0 border-none bg-gray100 rounded-[10px] outline-none text-sm"
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0"
                    type="submit"
                  >
                    <img src={searchIcon} alt="검색" className="w-[21px]" />
                  </button>
                </form>

                <UserProfile
                />
              </div>
            </div>
          </div>

          <div className="min-[835px]:hidden max-[834px]:flex max-[834px]:gap-5">
            <button
              className="w-7 h-7"
              type="submit"
              style={{ backgroundImage: `url(${searchIcon})` }}
            ></button>

            <button
              className="w-7 h-7"
              onClick={toggleMobileMenu}
              style={{ backgroundImage: `url(${hamburgerIcon})` }}
            ></button>
          </div>
        </div>
      </header>

      {/* <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
      /> */}
    </>
  );
};

export default Header;
