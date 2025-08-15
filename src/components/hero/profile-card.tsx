import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hook.ts";
import {
  selectIsAuthenticated,
  selectCurrentUser,
} from "../../auth/authSlice.ts";
import { goToMyLectures } from "../../store/slices/lectureSlice.ts";
import profileNoneImg from "../../assets/profile-none.png";
import profileImg from "../../assets/profile-img.png";
import { VideoIcon, UserIcon } from "../common/icon.tsx";
import { useNavigate } from "react-router-dom";

interface ProfileCardProps {
  onLogin: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ onLogin }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentUser = useAppSelector(selectCurrentUser);

  const getUserDisplayName = () => {
    if (currentUser?.name) {
      return `${currentUser.name}님`;
    } else if (currentUser?.email) {
      const username = currentUser.email.split("@")[0];
      return `${username}님`;
    }
    return "열정 만수르";
  };

  const getUserEmail = () => {
    return currentUser?.email || "paul-lab@naver.com";
  };

  const handleGoToMyLectures = () => {
    dispatch(goToMyLectures());
    navigate("/my-lectures");
  };

  if (isAuthenticated) {
    return (
      <article className="flex flex-col justify-center items-center w-[290px] p-8 box-border bg-white border border-gray200 rounded-[10px] text-center max-[834px]:hidden">
        <div className="w-[100px] h-[100px] overflow-hidden rounded-full border border-gray200 mb-3">
          <img
            className="w-full h-full object-cover"
            src={profileImg}
            alt="사용자 프로필"
          />
        </div>
        <h3 className="mb-2 text-main-text text-base font-semibold">
          {getUserDisplayName()}
        </h3>
        <p className="text-sm text-gray500 mb-6">{getUserEmail()}</p>

        <ul className="flex flex-col justify-center items-start gap-4 list-none">
          <li>
            <a
              href="#"
              className="flex items-center gap-3 text-gray500 font-medium cursor-pointer hover:text-main-text transition-colors"
              onClick={(e) => {
                e.preventDefault();
                handleGoToMyLectures();
              }}
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
      </article>
    );
  }

  return (
    <article className="flex flex-col justify-center items-center w-[290px] p-8 box-border bg-white border border-gray200 rounded-[10px] text-center max-[834px]:hidden">
      <div className="w-[100px] h-[100px] overflow-hidden rounded-full border border-gray200 mb-3">
        <img
          className="w-full h-full object-cover"
          src={profileNoneImg}
          alt="기본 프로필 이미지"
        />
      </div>
      <h3 className="mb-4 text-main-text text-base font-semibold">
        호기심 많은 개발자님
      </h3>
      <p className="text-base text-gray700 leading-[22px] mb-4">
        위니버시티에 로그인 후<br />
        커뮤니티와 함께 성장하세요.
      </p>
      <button
        className="w-full bg-primary text-white border-none rounded-[10px] py-[14px] px-0 text-sm font-medium transition-colors hover:bg-[#3a7ce0] transition-colors duration-200 ease-in-out "
        onClick={onLogin}
      >
        로그인
      </button>
    </article>
  );
};

export default ProfileCard;
