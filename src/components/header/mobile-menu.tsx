import React, { useState, useEffect } from "react";
import closeIcon from "../../assets/icon-close.png";
import profileNoneImg from "../../assets/profile-none.png";
import profileImg from "../../assets/profile-img.png";
import { VideoIcon, UserIcon } from "../common/icon.tsx";

interface MobileMenuProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  onClose: () => void;
  onLogin: () => void;
  onLogout: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  isLoggedIn,
  onClose,
  onLogin,
  onLogout,
}) => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    role: "",
  });

  // 로그인 상태 변경 시 사용자 정보 가져오기
  useEffect(() => {
    if (isLoggedIn) {
      const email = localStorage.getItem("user_email") || "";
      const role = localStorage.getItem("user_role") || "";
      setUserInfo({ email, role });
    } else {
      setUserInfo({ email: "", role: "" });
    }
  }, [isLoggedIn]);

  // 사용자 이름 표시 로직
  const getUserDisplayName = () => {
    if (userInfo.email) {
      // 이메일에서 @ 앞부분을 사용자명으로 사용
      const username = userInfo.email.split("@")[0];
      return `${username}님`;
    }
    return "위니브 소울곰";
  };

  return (
    <div className="min-[835px]:hidden ">
      <div
        className={`fixed top-0 left-0 w-full h-full  bg-black transition-opacity duration-300 z-[1] ${
          isOpen
            ? "opacity-50 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 bottom-0 flex flex-col items-center w-4/5 bg-white z-[1000]  transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          className="self-end mt-[18px] mr-[19px]"
          type="button"
          onClick={onClose}
        >
          <img src={closeIcon} alt="닫기" />
        </button>

        <article className="w-[226px] flex flex-col mb-9">
          <section className="flex flex-col items-center">
            <div className="w-[100px] h-[100px] overflow-hidden rounded-full border border-gray200 mb-3">
              <img
                className="w-full h-full object-cover"
                src={isLoggedIn ? profileImg : profileNoneImg}
                alt="프로필 이미지"
              />
            </div>
            <h2 className="mb-1 text-base font-semibold">
              {isLoggedIn ? getUserDisplayName() : "호기심 많은 개발자님"}
            </h2>
            <p className="text-gray700 leading-[22px] text-center mb-6">
              {isLoggedIn ? (
                userInfo.email || "paul-lab@naver.com"
              ) : (
                <>
                  위니버시티에 로그인 후<br />
                  커뮤니티와 함께 성장하세요.
                </>
              )}
            </p>
          </section>

          {!isLoggedIn ? (
            <button
              className="rounded-[10px] py-[14px] px-[94.5px] text-white bg-primary text-sm"
              onClick={onLogin}
            >
              로그인
            </button>
          ) : (
            <ul className="flex flex-col items-start gap-4 w-[180px] mx-auto">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 text-gray500 font-medium cursor-pointer hover:text-main-text transition-colors"
                >
                  <VideoIcon />내 강의 목록 보기
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 text-gray500 font-medium cursor-pointer hover:text-main-text transition-colors"
                >
                  <UserIcon />
                  마이페이지
                </a>
              </li>
            </ul>
          )}
        </article>

        <nav className="w-full border-t border-b border-gray200 py-[8px]">
          <ul className="flex flex-col list-none">
            <li>
              <a
                href="#"
                className="block px-5 py-2.5 text-sm font-medium text-main-text no-underline hover:bg-gray-100 transition-colors"
              >
                위니버시티 소개
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-5 py-2.5 text-sm font-medium text-main-text no-underline hover:bg-gray-100 transition-colors"
              >
                수강생 후기
              </a>
            </li>
          </ul>
        </nav>

        {isLoggedIn && (
          <div className="w-full border-b border-gray200  py-[8px]">
            <button
              className="block w-full text-left px-5 py-2.5 text-sm font-medium text-main-text hover:bg-gray-100 transition-colors"
              onClick={onLogout}
            >
              로그아웃
            </button>
          </div>
        )}

        <address className="self-start ml-4 not-italic mt-3 text-xs text-gray500">
          제보 및 문의: paul-lab@naver.com
        </address>
      </div>
    </div>
  );
};

export default MobileMenu;
