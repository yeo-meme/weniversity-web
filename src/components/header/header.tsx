import React, { useState } from "react";
import logoImg from "../../assets/logo.png";
import searchIcon from "../../assets/icon-search.png";
import hamburgerIcon from "../../assets/icon-hamburger.png";
import closeIcon from "../../assets/icon-close.png";
import profileNoneImg from "../../assets/profile-none.png";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 검색 로직 구현
  };

  const handleLogin = () => {
    // 로그인 로직 구현
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="flex items-center border-b border-[#d9dbe0] min-[835px]:justify-center min-[835px]:h-[70px] min-[835px]:px-4 max-[834px]:justify-between max-[834px]:w-full max-[834px]:h-14 max-[834px]:px-4">
        <div className="min-[835px]:flex min-[835px]:items-center min-[835px]:w-full min-[835px]:justify-around max-[834px]:contents">
          <h1 className="min-[835px]:flex-shrink-0 min-[835px]:w-34 md:w-36 lg:w-40 xl:w-[202px]">
            <a href="#">
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
                    className="text-[#121314] no-underline text-sm lg:text-base"
                  >
                    위니버시티 소개
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#121314] no-underline text-sm lg:text-base"
                  >
                    수강생 이야기
                  </a>
                </li>
              </ul>
            </nav>

            <div className="flex gap-3 md:gap-4 lg:gap-5 flex-shrink-0">
              <form role="search" className="relative" onSubmit={handleSearch}>
                <input
                  type="search"
                  placeholder="검색어를 입력하세요"
                  className="w-48 md:w-56 lg:w-64 xl:w-80 h-[42px] py-2.5 pl-5 pr-0 border-none bg-[#f3f5fa] rounded-[10px] outline-none text-sm"
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0"
                  type="submit"
                >
                  <img src={searchIcon} alt="검색" className="w-[21px]" />
                </button>
              </form>

              <button
                className="rounded-[10px] py-[11px] px-3 lg:px-5 text-white bg-[#2e6ff2] border-none cursor-pointer whitespace-nowrap text-sm"
                type="button"
                onClick={handleLogin}
              >
                로그인
              </button>
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
      </header>

      {/* 모바일 사이드바 */}
      <div className="min-[835px]:hidden">
        <div
          className={`fixed top-0 left-0 w-full h-full bg-black transition-opacity duration-300 z-[1] ${
            isMobileMenuOpen
              ? "opacity-50 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={closeMobileMenu}
        />
        <div
          className={`fixed top-0 right-0 bottom-0 flex flex-col items-center w-4/5 bg-white z-[1000] transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            className="self-end mt-[18px] mr-[19px]"
            type="button"
            onClick={closeMobileMenu}
          >
            <img src={closeIcon} alt="닫기" />
          </button>

          <section className="flex flex-col items-center">
            <div className="w-[100px] h-[100px] overflow-hidden rounded-full border border-[#d9dbe0] mb-3">
              <img
                className="w-full h-full object-cover"
                src={profileNoneImg}
                alt="프로필 이미지"
              />
            </div>
            <h2 className="mb-4 text-base font-semibold">
              호기심 많은 개발자님
            </h2>
            <p className="text-[#47494d] leading-[22px] text-center mb-4">
              위니버시티에 로그인 후<br />
              커뮤니티와 함께 성장하세요.
            </p>
          </section>

          <button
            className="rounded-[10px] py-[14px] px-[94.5px] text-white bg-[#2e6ff2] text-sm mb-9"
            onClick={handleLogin}
          >
            로그인
          </button>

          <nav className="w-full border-t border-b border-[#d9dbe0] mb-3 py-[18px]">
            <ul className="flex flex-col gap-5 ml-5 list-none">
              <li>
                <a
                  href="#"
                  className="text-sm font-medium text-[#121314] no-underline"
                >
                  위니버시티 소개
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm font-medium text-[#121314] no-underline"
                >
                  수강생 후기
                </a>
              </li>
            </ul>
          </nav>

          <address className="self-start ml-4 not-italic text-xs text-[#8d9299]">
            제보 및 문의: paul-lab@naver.com
          </address>
        </div>
      </div>
    </>
  );
};

export default Header;
