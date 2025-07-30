import React from "react";
import logoImg from "../../assets/logo.png";
import searchIcon from "../../assets/icon-search.png";

const PCHeader: React.FC = () => {
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 검색 로직 구현 예정
  };

  const handleLogin = () => {
    // 로그인 로직 구현 예정
  };

  return (
    <header className="flex items-center border-b border-[#d9dbe0] justify-center h-[70px] px-4">
      <div className="flex items-center w-full max-w-7xl">
        <h1 className="flex-shrink-0 mr-8 lg:mr-[303px]">
          <a href="#">
            <img src={logoImg} alt="logo" className="w-32 lg:w-[202px]" />
          </a>
        </h1>

        <div className="flex items-center gap-5 lg:gap-10">
          <nav className="hidden lg:block">
            <ul className="flex gap-6 xl:gap-10 list-none whitespace-nowrap">
              <li>
                <a href="#" className="text-[#121314] no-underline">
                  위니버시티 소개
                </a>
              </li>
              <li>
                <a href="#" className="text-[#121314] no-underline">
                  수강생 이야기
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex gap-3 lg:gap-5 flex-shrink-0">
            <form role="search" className="relative" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                className="w-48 lg:w-80 h-[42px] py-2.5 pl-5 pr-0 border-none bg-[#f3f5fa] rounded-[10px] outline-none"
              />
              <button
                className="absolute right-4 top-5 -translate-y-1/2 bg-transparent border-none p-0"
                type="submit"
              >
                <img src={searchIcon} alt="검색" className="w-[21px]" />
              </button>
            </form>

            <button
              className="w-[77px] rounded-[10px] py-[11px] px-5 text-[14px] text-white bg-[#2e6ff2] border-none"
              type="button"
              onClick={handleLogin}
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PCHeader;
