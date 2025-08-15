import React, { useState, useRef, useEffect } from "react";
import { useAppDispatch } from "../../hooks/hook";
import { goToMyLectures } from "../../store/slices/lecture-slice";
import profileImg from "../../assets/profile-img.png";
import { useNavigate } from "react-router-dom"; 
import { useAppSelector } from "../../hooks/hook"; 
import { useLogoutMutation, useLoginMutation } from "../../auth/authApiSlice"; 

const UserProfile: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); 

  const { user, token } = useAppSelector((state) => state.auth);
  const [logoutMutation] = useLogoutMutation();
  const [loginMutation] = useLoginMutation();

  const isActuallyLoggedIn = !!user?.email && !!token;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await logoutMutation({
        access: token || undefined,
      }).unwrap();
    } catch (error) {
      console.error("로그아웃 오류:", error);
    } finally {
      setIsDropdownOpen(false);
    }
  };


      // onLogout();
  const handleGoToMyLectures = () => {
    dispatch(goToMyLectures());
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* 로그인 전 버튼 */}
      {!isActuallyLoggedIn && (
        <button
          className="rounded-[10px] py-[11px] px-3 lg:px-5 text-white bg-primary whitespace-nowrap text-sm"
          type="button"
          onClick={() => {
            navigate('/login')
          }}
        >
          로그인
        </button>
      )}

      {/* 로그인 후 프로필 버튼 + 드롭다운 */}
      {isActuallyLoggedIn && (
        <div className="relative inline-block" ref={dropdownRef}>
          <button
            className="flex items-center w-[42px] h-[42px] rounded-full bg-transparent p-0 transition-all relative"
            type="button"
            onClick={toggleDropdown}
            title={user?.email ? `${user.email}님의 프로필` : "사용자 프로필"}
          >
            <img
              src={profileImg}
              alt="사용자 프로필"
              className="w-full h-full object-cover rounded-full"
            />
            <div
              className={`absolute inset-0 rounded-full pointer-events-none transition-all z-10 ${
                isDropdownOpen
                  ? "border-[3px] border-primary"
                  : "border-[3px] border-transparent"
              }`}
            />
          </button>

          <div
            className={`absolute top-full right-0 bg-white border border-gray200 rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.1)] min-w-[240px] z-[1000] mt-2 py-2 overflow-hidden transition-all duration-200 ease-in-out ${
              isDropdownOpen
                ? "opacity-100 translate-y-0 visible"
                : "opacity-0 -translate-y-2.5 invisible"
            }`}
          >
            <nav>
              <a
                href="#"
                className="block py-2.5 pl-5 pr-0 no-underline text-main-text bg-transparent text-sm font-medium cursor-pointer hover:bg-gray100"
                onClick={(e) => {
                  e.preventDefault();
                  handleGoToMyLectures();
                }}
              >
                내 강의 목록
              </a>
              <a
                href="#"
                className="block py-2.5 pl-5 pr-0 no-underline text-main-text bg-transparent text-sm font-medium cursor-pointer hover:bg-gray100"
              >
                마이페이지
              </a>
              <hr className="my-2 border-t border-gray200 block mx-0 border-solid border-t-[1px]" />
              <button
                className="block py-2.5 pl-5 pr-0 text-main-text bg-transparent border-none text-left cursor-pointer text-sm font-medium w-full hover:bg-gray100"
                type="button"
                onClick={handleLogout}
              >
                로그아웃
              </button>
              <hr className="my-2 border-t border-gray200 block mx-0 border-solid border-t-[1px]" />
            </nav>
            <address className="py-2 pl-4 pr-0 text-xs text-gray500 not-italic">
              제보 및 문의: paul-lab@naver.com
            </address>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
