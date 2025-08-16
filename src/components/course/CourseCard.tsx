import React, { useCallback, useState } from "react";
import type { Course } from "../../types/course/course";
import HeartIconHover from "../../assets/icon-heart-hover.png";
import HeartIcon from "../../assets/icon-heart.png";
import HeartPicked from "../../assets/icon-heart-picked.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAppDispatch, useAppSelector } from "../../hooks/hook";
import { toggleCourseLike } from "../../store/courseSlice";

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const likedCourses = useAppSelector(state => state.course.likedCourses);
  const isLiked = likedCourses.includes(String(course.course_id));

  const getLike = async (
    courseId: string,
    isLiked: boolean,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();

    if (!isAuthenticated) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }

    if (isLikeLoading) {
      console.log("이미 처리 중입니다.");
      return;
    }

    setIsLikeLoading(true);

    try {
      await dispatch(toggleCourseLike({ courseId, isLiked })).unwrap();
    } catch (error) {
      console.error("좋아요 처리 중 오류:", error);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLikeLoading(false);
    }
  };

  const navigateToCourseDetail = (id: string) => {
    navigate(`/courses/${id}`);
  };

  const getPriceLabel = (price?: number) => {
    if (price === undefined) return "정보없음";
    if (price === -1) return "국비지원";
    if (price === 0) return "무료";
    if (price > 0) return "유료";
    return "정보없음";
  };

  const getTypeLabel = (type: string) => {
    if (type === "vod") return "VOD";
    if (type === "boost") return "부스트 커뮤니티";
  };

  const formatPrice = useCallback((price: number | undefined) => {
    if (price === undefined) return "정보 없음";
    if (price === 0) return "무료 강의";
    if (price === -1) return "국비 지원 강의";
    if (price > 0) return `₩ ${price.toLocaleString()}`;
    return "";
  }, []);

  const getHeartImage = () => {
    if (isLiked) return HeartPicked;
    return isHovered ? HeartIconHover : HeartIcon;
  };

  return (
    <div className="rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 course-card cursor-pointer">
      <div
        className="relative bg-python-gradient rounded-t-lg overflow-hidden"
        onClick={() => navigateToCourseDetail(course.course_id)}
      >
        {/* 강의 이미지 */}
        <img src={course.course_image} alt="강의이미지" />

        {/* 좋아요 이미지 */}
        {isAuthenticated && (
          <img
            src={getHeartImage()}
            alt="좋아요"
            className="absolute top-4 right-4 transition-all duration-200 cursor-pointer"
            onMouseEnter={() => !isLiked && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={event => getLike(course.course_id, isLiked, event)}
          />
        )}
      </div>

      {/* 코스 정보 */}
      <div className="p-4">
        {/* 태그들 */}
        <div className="flex gap-2 mb-3">
          <span className="px-3 py-1 rounded-md text-xs font-medium bg-gray-700 text-white">
            {getTypeLabel(course.type)}
          </span>
          <span className="px-3 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700">
            {course.category}
          </span>
          <span className="px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
            {course.level}
          </span>
          <span className="px-3 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-700">
            {getPriceLabel(course.price)}
          </span>
        </div>

        {/* 코스 제목 */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>

        {/* 강사 정보 */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src={course.instructors?.[0]?.profile_image}
              alt="강사"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center">
            <p className="text-sm font-medium text-gray-900">
              {course.instructors[0].name}
            </p>
            <p className="ml-2 text-xs text-gray-500">
              {course.instructors[0].affiliation}
            </p>
          </div>
        </div>

        {/* 코스 설명 */}
        <p className="text-sm text-gray-900 line-clamp-2 mt-4 p-5 min-h-[80px]">
          {course.description}
        </p>

        {/* 가격 정보 */}
        <p className="text-sm font-medium text-gray-900 mt-4">
          {formatPrice(course.price)}
        </p>
      </div>
    </div>
  );
};

export default CourseCard;
