import React from "react";
import LectureCard from "../../components/lectures/lectureCard";
import LectureFilter from "../../components/lectures/lectureFilter";
import { useGetMyLecturesQuery } from "../../store/slices/lectureApiSlice";
import type { LectureQueryParams } from "../../types/lecture";

const MyLectures = () => {
  const [selectedSubject, setSelectedSubject] = React.useState<string>("전체");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("전체");

  const queryParams: LectureQueryParams = React.useMemo(() => {
    const params: LectureQueryParams = {};

    if (selectedSubject !== "전체") {
      if (selectedSubject === "VOD") {
        params.type = "vod";
      } else if (selectedSubject === "부스트 커뮤니티") {
        params.type = "boost";
      }
    }

    if (selectedStatus !== "전체") {
      if (selectedStatus === "학습 가능") {
        params.status = "available";
      } else if (selectedStatus === "수강 종료") {
        params.status = "expired";
      }
    }

    return params;
  }, [selectedSubject, selectedStatus]);

  const {
    data: lecturesData,
    error,
    isLoading,
    refetch,
  } = useGetMyLecturesQuery(queryParams);

  const statusOptions = ["전체", "학습 가능", "수강 종료"] as const;
  const subjectOptions = ["전체", "VOD", "부스트 커뮤니티"] as const;

  const handleLearnClick = (_lectureId: string) => {
    // TODO: 강의 학습 페이지로 이동
  };

  const handleDetailClick = (_lectureId: string) => {
    // TODO: 강의 상세 페이지로 이동
  };

  const handleReapplyClick = (_lectureId: string) => {
    // TODO: 재수강 신청 로직
  };

  const getErrorMessage = (error: unknown): string => {
    if (error && typeof error === "object" && "message" in error) {
      return error.message as string;
    }
    return "알 수 없는 오류가 발생했습니다.";
  };

  console.log(localStorage.getItem("persist:auth"));
  console.log(localStorage.getItem("persist:page"));

  const authStr = localStorage.getItem("persist:auth");
  if (authStr) {
    const auth = JSON.parse(authStr);
    const user = JSON.parse(auth.user);
    console.log("💾 persist:auth.user:", user);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5 p-5 max-[834px]:p-4 max-[834px]:gap-4 max-[834px]:flex-col mt-[40px]">
        <h2 className="text-[40px] font-bold mb-6">내 강의 목록</h2>
        <div className="text-center py-12">
          <p className="text-gray500">강의 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-5 p-5 max-[834px]:p-4 max-[834px]:gap-4 max-[834px]:flex-col mt-[40px]">
        <h2 className="text-[40px] font-bold mb-6">내 강의 목록</h2>
        <div className="text-center py-12">
          <p className="text-error">강의 목록을 불러오는데 실패했습니다.</p>
          <p className="text-sm text-gray500 mt-2">{getErrorMessage(error)}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const lectures = lecturesData?.results || [];

  return (
    <div className="flex flex-col gap-5 p-5 max-[834px]:p-4 max-[834px]:gap-4 max-[834px]:flex-col mt-[40px]">
      <h2 className="text-[40px] font-bold mb-6">내 강의 목록</h2>

      <div className="border-y-2 border-gray200 mb-8">
        <div className="flex items-center p-5 border-b border-gray200">
          <h3 className="font-bold text-main-text mr-5 w-20">상태</h3>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <LectureFilter
                key={status}
                label={status}
                value={status}
                isActive={selectedStatus === status}
                onClick={setSelectedStatus}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center p-5">
          <h3 className="font-bold text-main-text mr-5 w-20">유형</h3>
          <div className="flex flex-wrap gap-2">
            {subjectOptions.map((subject) => (
              <LectureFilter
                key={subject}
                label={subject}
                value={subject}
                isActive={selectedSubject === subject}
                onClick={setSelectedSubject}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lectures.map((lecture: any) => (
          <LectureCard
            key={lecture.id}
            thumbnailSrc={lecture.thumbnail}
            tags={lecture.tags}
            title={lecture.title}
            currentProgress={lecture.current_progress}
            totalLessons={lecture.total_lessons}
            progressPercentage={lecture.progress_percentage}
            isExpired={lecture.is_expired}
            onLearnClick={() => handleLearnClick(lecture.id)}
            onDetailClick={() => handleDetailClick(lecture.id)}
            onReapplyClick={() => handleReapplyClick(lecture.id)}
          />
        ))}
      </div>

      {lectures.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray500">조건에 맞는 강의가 없습니다.</p>
        </div>
      )}

      {lecturesData && (
        <div className="text-sm text-gray500 mt-4">
          총 {lecturesData.count}개의 강의
        </div>
      )}
    </div>
  );
};

export default MyLectures;
