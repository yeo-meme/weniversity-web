import React from "react";
import LectureCard from "../../components/lectures/lecture-card.tsx";

// 타입 정의
interface Tag {
  text: string;
  type: "type" | "kind";
}

interface Lecture {
  id: string;
  thumbnailSrc: string;
  tags: Tag[];
  title: string;
  currentProgress: number;
  totalLessons: number;
  progressPercentage: number;
  isExpired: boolean;
}

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const MyLectures = () => {
  // 필터 상태
  const [selectedSubject, setSelectedSubject] = React.useState<string>("전체");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("전체");

  // 강의 데이터
  const lectures: Lecture[] = [
    {
      id: "1",
      thumbnailSrc: "src/assets/OG.png",
      tags: [
        { text: "부스트 커뮤니티", type: "type" },
        { text: "백엔드", type: "kind" },
        { text: "초급", type: "kind" },
      ],
      title: "파이썬 강의",
      currentProgress: 3,
      totalLessons: 15,
      progressPercentage: 20,
      isExpired: false,
    },
    {
      id: "2",
      thumbnailSrc: "src/assets/OG.png",
      tags: [
        { text: "정규 과정", type: "type" },
        { text: "프론트엔드", type: "kind" },
        { text: "중급", type: "kind" },
      ],
      title: "React 강의",
      currentProgress: 8,
      totalLessons: 20,
      progressPercentage: 40,
      isExpired: false,
    },
    {
      id: "3",
      thumbnailSrc: "src/assets/OG.png",
      tags: [
        { text: "부스트 커뮤니티", type: "type" },
        { text: "풀스택", type: "kind" },
        { text: "고급", type: "kind" },
      ],
      title: "Node.js 강의",
      currentProgress: 12,
      totalLessons: 18,
      progressPercentage: 67,
      isExpired: true,
    },
  ];

  // 필터 옵션
  const statusOptions = ["전체", "학습 가능", "종료"] as const;
  const subjectOptions = ["전체", "VOD", "부스트 커뮤니티", "KDC"] as const;

  // 필터링
  const filteredLectures = lectures.filter((lecture) => {
    const subjectMatch =
      selectedSubject === "전체" ||
      lecture.tags.some((tag) => tag.text === selectedSubject);

    const statusMatch =
      selectedStatus === "전체" ||
      (selectedStatus === "학습 가능" && !lecture.isExpired) ||
      (selectedStatus === "종료" && lecture.isExpired);

    return subjectMatch && statusMatch;
  });

  // 필터 버튼
  const FilterButton: React.FC<FilterButtonProps> = ({
    label,
    isActive,
    onClick,
  }) => (
    <span
      className={`px-3 py-1.5 text-base cursor-pointer ${
        isActive ? "text-blue-500 font-bold" : "text-black"
      }`}
      onClick={onClick}
    >
      {label}
    </span>
  );

  // 이벤트 핸들러
  const handleLearnClick = () => {
    console.log("학습하기");
  };

  const handleDetailClick = () => {
    console.log("상세보기");
  };

  const handleReapplyClick = () => {
    console.log("재수강");
  };

  console.log(localStorage.getItem('persist:auth'));
  console.log(localStorage.getItem('persist:page'));

  const authStr = localStorage.getItem('persist:auth');
if (authStr) {
  const auth = JSON.parse(authStr);
  const user = JSON.parse(auth.user);
  console.log("💾 persist:auth.user:", user);
}

  return (
    <div className="flex flex-col gap-5 p-5 max-[834px]:p-4 max-[834px]:gap-4 max-[834px]:flex-col mt-[40px]">
      <h2 className="text-[40px] font-bold mb-6">내 강의 목록</h2>

      {/* 필터 섹션 */}
      <div className="border-y-2 border-gray-200 mb-8">
        {/* 상태 필터 */}
        <div className="flex items-center p-5 border-b border-gray-200">
          <h3 className="font-bold text-gray-700 mr-5 w-20">상태</h3>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <FilterButton
                key={status}
                label={status}
                isActive={selectedStatus === status}
                onClick={() => setSelectedStatus(status)}
              />
            ))}
          </div>
        </div>

        {/* 유형 필터 */}
        <div className="flex items-center p-5">
          <h3 className="font-bold text-gray-700 mr-5 w-20">유형</h3>
          <div className="flex flex-wrap gap-2">
            {subjectOptions.map((subject) => (
              <FilterButton
                key={subject}
                label={subject}
                isActive={selectedSubject === subject}
                onClick={() => setSelectedSubject(subject)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 강의 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLectures.map((lecture) => (
          <LectureCard
            key={lecture.id}
            thumbnailSrc={lecture.thumbnailSrc}
            tags={lecture.tags}
            title={lecture.title}
            currentProgress={lecture.currentProgress}
            totalLessons={lecture.totalLessons}
            progressPercentage={lecture.progressPercentage}
            isExpired={lecture.isExpired}
            onLearnClick={handleLearnClick}
            onDetailClick={handleDetailClick}
            onReapplyClick={handleReapplyClick}
          />
        ))}
      </div>

      {/* 빈 결과 */}
      {filteredLectures.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">조건에 맞는 강의가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default MyLectures;
