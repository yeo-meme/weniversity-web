import React, { useRef,useState, useEffect, useMemo } from "react";
import {
  Play,
  Clock,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  X,
} from "lucide-react";
import { ProgressCalculator } from "../../utils/progressCalculator";
// import { VideoPlayer } from "../video/VideoPlayer"


interface VideoPlayerProps {
  currentVideo: string;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onLoadedMetadata: (duration: number) => void;
  onEnded: () => void;
  onPlay: () => void; // ▶️ 재생 시작 이벤트 추가
  startTime?: number;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentVideo,
  onTimeUpdate,
  onLoadedMetadata,
  onEnded,
  onPlay,
  startTime = 0,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSentTimeRef = useRef(0);

  const [currentTime, setCurrentTime] = useState(startTime);
  const [duration, setDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [isReady, setIsReady] = useState(false);

  //tartTime 변경 감지
  useEffect(() => {
    console.log(`🔄 VideoPlayer startTime 변경: ${startTime.toFixed(1)}초`);
    setCurrentTime(startTime);
    setIsReady(true); // 준비 완료
  }, [startTime]);

  //비디오 변경 시 초기화
  useEffect(() => {
    console.log(`🎬 비디오 변경: ${currentVideo}`);
    setCurrentTime(startTime);
    setDuration(0);
    setIsPaused(true);
  }, [currentVideo, startTime]);

  //이벤트 리스너 등록만 담당 (한 번만)
  // useEffect(() => {
  //   const video = videoRef.current;
  //   if (!video) return;

  //   const handleLoadedMetadata = () => {
  //     setDuration(video.duration);

  //     // ⭐️ 핵심: startTime 적용 및 UI 상태 동기화
  //     if (startTime > 0) {
  //       e.currentTarget.currentTime = startTime;
  //       setCurrentTime(startTime); // 🔥 UI 상태도 즉시 동기화
  //       console.log(`✅ 시작 지점 설정: ${startTime.toFixed(1)}초`);
  //     } else {
  //       setCurrentTime(0);
  //       console.log(`✅ 처음부터 시작: 0초`);
  //     }

  //     // onLoadedMetadata는 useCallback으로 안정화된 함수 사용
  //     onLoadedMetadata?.();
  //   };

  //   video.addEventListener("loadedmetadata", handleLoadedMetadata);

  //   return () => {
  //     video.removeEventListener("loadedmetadata", handleLoadedMetadata);
  //   };
  // }, [currentVideo]);
  // const formatTime = (seconds: number): string => {
  //   const hrs = Math.floor(seconds / 3600);
  //   const mins = Math.floor((seconds % 3600) / 60);
  //   const secs = Math.floor(seconds % 60);
  //   return hrs > 0
  //     ? `${hrs}:${mins.toString().padStart(2, "0")}:${secs
  //         .toString()
  //         .padStart(2, "0")}`
  //     : `${mins}:${secs.toString().padStart(2, "0")}`;
  // };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch((error) => {
        console.log("재생 안 됨", error);
      });
    } else {
      video.pause();
    }
  };

  const handleLoadStart = () => {
    console.log(`📥 비디오 로드 시작: ${currentVideo}`);
  };

  const handleCanPlay = () => {
    console.log(`✅ 비디오 재생 준비 완료: ${currentVideo}`);
  };

  const handleError = (e: any) => {
    console.error(`❌ 비디오 로드 에러: ${currentVideo}`, e);
  };

  const handleLoadedData = () => {
    console.log(`📊 비디오 데이터 로드 완료: ${currentVideo}`);
  };

  //1
  const onVideoTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const current = video.currentTime;

    setCurrentTime(current); // UI 상태 업데이트
    const now = Date.now();
    if (now - lastSentTimeRef.current > 500) {
      onTimeUpdate(current, video.duration); // 부모에 전달
      lastSentTimeRef.current = now; // 4. 시간 갱신
    }
  };

  const syncVideoDuration = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const { duration } = video;
    setDuration(duration);
    console.log(`⏱️ 비디오 길이 감지: ${duration.toFixed(1)}초`);

    if (startTime > 0) {
      video.currentTime = startTime;
      setCurrentTime(startTime);
      console.log(`🎥 시작 지점: ${startTime.toFixed(1)}초`);
    } else {
      setCurrentTime(0); // 명시적 초기화
    }
    onLoadedMetadata(duration);
  };



  // const handleTimeUpdate = () => {
  //   if (videoRef.current) {
  //     const { currentTime, duration } = videoRef.current;
  //     onTimeUpdate(currentTime, duration);
  //   }
  // };

  // const handleLoadedMetadata = () => {
  //   if (videoRef.current) {
  //     const { duration } = videoRef.current;
  //     onLoadedMetadata(duration);

  //     // 메타데이터 로드 후 시작 지점 설정
  //     if (startTime > 0) {
  //       videoRef.current.currentTime = startTime;
  //     }
  //   }
  // };

  const handleEnded = () => {
    onEnded();
  };

  const handleVideoPlayUI = () => {
    console.log("onPlay 호출됨 → isPaused = false");
    setIsPaused(false);
    onPlay(); // 부모 컴포넌트의 onPlay 콜백 호출
  };

  const handleVideoPauseUI = () => {
    console.log("onPause 호출됨 → isPaused = true");
    setIsPaused(true);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || duration === 0) return;
  
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const progressBarWidth = rect.width;
    const newTime = (clickPosition / progressBarWidth) * duration;
  
    video.currentTime = newTime;
    setCurrentTime(newTime);
    onTimeUpdate(newTime, duration); // 즉시 부모에게도 전달
  };

  // ▶️ 재생 시작 이벤트 핸들러 추가
  // const handlePlay = () => {
  //   console.log("🎬 비디오 재생 시작!");
  //   onPlay();
  // };

  return (
    <div className="relative w-full">
      <video
        ref={videoRef}
        onTimeUpdate={onVideoTimeUpdate}
        onLoadedMetadata={syncVideoDuration}
        onEnded={handleEnded}
        onPlay={handleVideoPlayUI}
        onPause={handleVideoPauseUI}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onError={handleError}
        onLoadedData={handleLoadedData}
        controls={false}
        className="w-full aspect-video rounded-lg"
      >
        <source src={`/video/${currentVideo}`} type="video/mp4" />
        브라우저가 video 태그를 지원하지 않습니다.
      </video>

      <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 rounded-lg p-2">
        <div className="flex items-center gap-3">
          {/* 디버그용: 상태 직접 확인 */}
          <div className="text-red-500 text-xs mb-2">
            Debug: isPaused = {isPaused ? "true" : "false"}
          </div>
          {/* 재생/일시정지 버튼 */}
          <button onClick={handlePlayPause} className="text-white text-xl">
            {isPaused ? "▶️" : "⏸️"}
          </button>

          {/* 시간 표시 */}
          <span className="text-white text-sm">
          {ProgressCalculator.formatTime(currentTime)} / {ProgressCalculator.formatTime(duration)}
          </span>

          {/* 진행률 바 */}
          <div
            className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-50"
              style={{
                width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};


// 🆕 Props 타입 정의 수정
interface StudyLayoutPlayerProps {
  onClose: () => void;
  courseData: {
    id: number;
    title: string;
    description?: string;
  } | null;
  userId?: string;
}

interface Chapter {
  id: number;
  title: string;
  time: string;
  duration: string;
  durationSeconds: number;
  videoFile: string;
  completed: boolean;
}

// ✅ chapters 데이터
const chapters: Chapter[] = [
  {
    id: 1,
    title: "변수와 상수",
    time: "0:00",
    duration: "5:00",
    durationSeconds: 5,
    videoFile: "video1.mp4",
    completed: false,
  },
  {
    id: 2,
    title: "연산자 종류",
    time: "5:00",
    duration: "10:00",
    durationSeconds: 5,
    videoFile: "video2.mp4",
    completed: false,
  },
  {
    id: 3,
    title: "조건문 기초",
    time: "15:00",
    duration: "8:00",
    durationSeconds: 5,
    videoFile: "video3.mp4",
    completed: false,
  },
  {
    id: 4,
    title: "반복문 활용",
    time: "23:00",
    duration: "12:00",
    durationSeconds: 5,
    videoFile: "video4.mp4",
    completed: false,
  },
  {
    id: 5,
    title: "함수 정의",
    time: "35:00",
    duration: "15:00",
    durationSeconds: 5,
    videoFile: "video5.mp4",
    completed: false,
  },
  {
    id: 6,
    title: "실습 문제",
    time: "50:00",
    duration: "10:00",
    durationSeconds: 5,
    videoFile: "video6.mp4",
    completed: false,
  },
];

const StudyLayoutPlayer: React.FC<StudyLayoutPlayerProps> = ({
  onClose,
  courseData,
  userId = "user123",
}) => {
  // ✅ 기존 상태들
  const STORAGE_KEY = "cachedProgress";
  const [cachedProgress, setCachedProgress] = useState<Record<number, any>>({});
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [completedChapters, setCompletedChapters] = useState(new Set<number>());
  const [chapterProgress, setChapterProgress] = useState<
    Record<number, number>
  >({});
  const [startTime, setStartTime] = useState(0);
  const [hasProgressData, setHasProgressData] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(0);

  // 🆕 새 UI용 상태
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(
    new Set([1, 2])
  );


  // 🆕 UI용 변수들
  const courseTitle = courseData?.title || "프로그래밍 기초 강의";
  const currentChapter = chapters[currentChapterIndex];
  const totalDuration = chapters.reduce(
    (acc, chapter) => acc + chapter.durationSeconds,
    0
  );

  // 🔍 초기 상태 로그 (컴포넌트 렌더링 시마다 실행)
  console.log("🔍 [초기 상태 확인]");
  console.log("  📋 chapters.length:", chapters.length);
  console.log("  📋 currentChapterIndex:", currentChapterIndex);
  console.log("  📋 currentChapter:", currentChapter);
  console.log("  📋 currentChapter?.id:", currentChapter?.id);
  console.log("  📋 currentChapter?.title:", currentChapter?.title);
  console.log("  📋 userId:", userId);


  // 🆕 챕터 그룹 토글 함수
  const toggleGroup = (groupId: number) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  // ✅ useEffect들
  useEffect(() => {
    const savedCache = localStorage.getItem(STORAGE_KEY);
    console.log("✅ 로컬스토리지 불러오기:", savedCache);

    if (savedCache) {
      const parsed = JSON.parse(savedCache);
      setCachedProgress(parsed);
      console.log("📦 캐시 설정 완료:", parsed);
    }

    loadExistingProgress();
  }, [userId]);

  useEffect(() => {
    try {
      const json = JSON.stringify(cachedProgress);
      localStorage.setItem(STORAGE_KEY, json);
      console.log("✅ 로컬스토리지에 진행률 저장 완료:", json);
    } catch (error) {
      console.error("❌ 로컬스토리지 저장 실패:", error);
    }
  }, [cachedProgress]);

  useEffect(() => {
    if (Object.keys(cachedProgress).length > 0) {
      const chapterId = chapters[currentChapterIndex]?.id;
      if (chapterId && cachedProgress[chapterId]?.currentTime) {
        const savedTime = cachedProgress[chapterId].currentTime;
        setStartTime(savedTime);
        console.log(`🎯 챕터 ${chapterId} 진행률 적용: ${savedTime}초`);
      } else {
        setStartTime(0);
        console.log(`🎯 챕터 ${chapterId} 처음부터 시작`);
      }
    }
  }, [currentChapterIndex]);

  useEffect(() => {
    if (currentChapterIndex >= 0) {
      checkExistingChapterProgress(currentChapterIndex);
    }
  }, [currentChapterIndex]);

  useEffect(() => {
    console.log(`🔄 VideoPlayer startTime 변경: ${startTime.toFixed(1)}초`);
    setCurrentTime(startTime);
  }, [startTime]);

  // ✅ 기존 함수들
  const loadExistingProgress = () => {
    const progressCache: Record<number, any> = {};
    const userCompletedChapters = new Set<number>();
    const userChapterProgress: Record<number, number> = {};

    chapters.forEach((chapter, index) => {
      const progress = cachedProgress[chapter.id];
      if (progress) {
        progressCache[chapter.id] = progress;
        if (progress.isCompleted) {
          userCompletedChapters.add(index);
        }
        userChapterProgress[index] = progress.currentTime;
      }
    });

    setCachedProgress(progressCache);
    setCompletedChapters(userCompletedChapters);
    setChapterProgress(userChapterProgress);

    console.log(`📈 진행률 캐시 완료:`, progressCache);
  };

  const checkExistingChapterProgress = (chapterIndex: number) => {
    const chapter = chapters[chapterIndex];
    if (!chapter || !userId) {
      console.warn("⚠️ chapter 또는 userId 없음 — 진행률 확인 생략");
      return;
    }

    const progress = getProgressFromCache(chapter.id);

    if (progress && typeof progress.currentTime === "number") {
      console.log(`저장시작 : ${progress.currentTime.toFixed(1)}`);
      setHasProgressData(true);
      console.log(
        `📖 기존 진행률 발견 - 챕터 ${chapter.id}: ${progress.currentTime}초부터`
      );
    } else {
      setHasProgressData(false);
      console.log(`📝 새 챕터 - 챕터 ${chapter.id}: 처음부터 시작`);
    }
  };

  const getProgressFromCache = (chapterId: number) => {
    const 냉장고_내용 = cachedProgress[chapterId];

    if (냉장고_내용) {
      console.log(`🏠 냉장고에서 발견: 챕터 ${chapterId}`);
      return 냉장고_내용;
    } else {
      console.log(`❌ 냉장고에 없음: 챕터 ${chapterId}`);
      return null;
    }
  };

  // 🎬 비디오 재생 시작 시 진행률 생성
  const handleVideoPlay = () => {
    console.log(`🎬 비디오 재생 시작 - 챕터 ${currentChapter.id}`);

    if (!hasProgressData) {
      console.log(
        `📝 새 진행률 생성: 사용자 ${userId}, 챕터 ${currentChapter.id}`
      );
      setHasProgressData(true);
    }

    setIsVideoPlaying(true);
  };
// 🎥 비디오 시간 업데이트 핸들러 (진행률 데이터가 있을 때만 저장)
  const onVideoProgress = (currentTime: number, videoDuration: number) => {
    setCurrentTime(currentTime);

    const progress = Math.min(currentTime, videoDuration);
    setChapterProgress((prev) => ({
      ...prev,
      [currentChapterIndex]: progress,
    }));

    if (hasProgressData && isVideoPlaying) {
      const now = Date.now();
      if (now - lastSaveTime > 1000) {
        const watchedPercentage =
          videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0;

        console.log(
          `💾 진행률 저장: ${watchedPercentage.toFixed(
            1
          )}% (${currentTime.toFixed(1)}초)`
        );

        setLastSaveTime(now);
      }
    }

    // ✅ 유틸 함수 사용
    if (ProgressCalculator.isChapterCompleted(currentTime, videoDuration)) {
      if (!completedChapters.has(currentChapterIndex)) {
        setCompletedChapters((prev) => new Set([...prev, currentChapterIndex]));

        if (hasProgressData) {
          console.log(`🎉 챕터 완료: ${currentChapter.title}`);
        }
      }
    }
  };
// 🎥 비디오 메타데이터 로드 핸들러
  const onVideoReady = (videoDuration: number) => {
    setDuration(videoDuration);
    console.log(`📊 비디오 메타데이터 로드: ${videoDuration}초`);
  };
// 🎥 비디오 끝남 핸들러
  const handleVideoEnded = () => {
    console.log(`🏁 비디오 재생 완료: ${currentChapter.title}`);

    setCompletedChapters((prev) => new Set([...prev, currentChapterIndex]));
    setIsVideoPlaying(false);

    if (currentChapterIndex < chapters.length - 1) {
      console.log(
        `➡️ 다음 챕터로 자동 이동: ${chapters[currentChapterIndex + 1].title}`
      );
      setCurrentTime(0);
      setDuration(0);
      setCurrentChapterIndex(currentChapterIndex + 1);
    } else {
      console.log(`🎊 모든 챕터 완료!`);
    }
  };

  // 🎯 챕터 클릭 핸들러 (진행률 확인만, 생성하지 않음)
  const handleChapterClick = (chapterIndex: number) => {
    const selectedChapter = chapters[chapterIndex];
    console.log(`🎬 챕터 선택: ${selectedChapter.title}`);

    setCurrentChapterIndex(chapterIndex);
    setCurrentTime(0);
    setIsVideoPlaying(false);
  };

  

  return (
    <div className="flex h-screen bg-white">
      {/* 왼쪽 사이드바 */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
        {/* 헤더 */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-semibold text-gray-900">강의 목록</h1>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600">{courseTitle}</p>
        </div>

        {/* 챕터 목록 */}
        <div className="p-2">
          <div className="mb-2">
            <div className="p-3">
              <span className="font-medium text-gray-900 text-sm">
                프로그래밍 기초 강의
              </span>
            </div>

            <div className="ml-4 space-y-1">
              {chapters.map((chapter, index) => {
                const isCurrent = chapter.id === currentChapter?.id;
                const isCompleted = completedChapters.has(index);
                const currentProgress = chapterProgress[index]
                  ? Math.round(
                      (chapterProgress[index] / chapter.durationSeconds) * 100
                    )
                  : 0;
                const hasProgress = currentProgress > 0;

                return (
                  <button
                    key={chapter.id}
                    onClick={() => handleChapterSelect(chapter.id)}
                    className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-colors ${
                      isCurrent
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {/* 아이콘 */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isCurrent
                          ? "bg-blue-500 text-white"
                          : hasProgress
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : isCurrent ? (
                        <Play className="w-3 h-3" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>

                    {/* 챕터 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm font-medium truncate ${
                            isCurrent ? "text-blue-900" : "text-gray-900"
                          }`}
                        >
                          {chapter.title}
                        </p>
                        <span className="text-xs text-gray-500 ml-2">
                          {chapter.duration}
                        </span>
                      </div>

                      {/* 진행률 바 */}
                      {hasProgress && !isCompleted && (
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-yellow-400 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${currentProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽 비디오 영역 */}
      <div className="flex-1 flex flex-col">
        {/* 비디오 헤더 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {currentChapter?.title || "영상을 선택해주세요"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {courseTitle} • {currentChapter?.duration || "0:00"}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>
                총 시간: {ProgressCalculator.formatTime(totalDuration)}
              </span>
            </div>
          </div>
        </div>

        {/* 비디오 플레이어 영역 */}
        <div className="flex-1 bg-black relative">
          {currentChapter ? (
            <VideoPlayer
              currentVideo={currentChapter.videoFile}
              onTimeUpdate={onVideoProgress}
              onLoadedMetadata={onVideoReady}
              onEnded={handleVideoEnded}
              onPlay={handleVideoPlay}
              startTime={startTime}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <p className="text-lg">왼쪽에서 학습할 챕터를 선택해주세요</p>
              </div>
            </div>
          )}

          
        </div>

        {/* 하단 네비게이션 */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              현재 진행률:{" "}
              <span className="font-medium text-gray-900">
                {/* {Math.round(
                  ProgressCalculator.getOverallProgress(chapters, progressMap)
                )} */}
                %
              </span>
            </div>
            <button
              onClick={() => {
                if (currentChapterIndex < chapters.length - 1) {
                  setCurrentChapterIndex(currentChapterIndex + 1);
                }
              }}
              disabled={currentChapterIndex >= chapters.length - 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {currentChapterIndex >= chapters.length - 1
                ? "마지막 영상"
                : "다음 영상"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyLayoutPlayer;
