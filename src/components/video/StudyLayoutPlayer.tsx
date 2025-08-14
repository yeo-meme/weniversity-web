import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Play,
  Clock,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  X,
} from "lucide-react";
import { ProgressCalculator } from "../../utils/progressCalculator";
import { ProgressTracker } from "../../services/ProgressTracker";
import type {
  LocalProgressCache,
  LocalCourseCache,
  LocalChapterCache,
} from "../../types/progress.types";

import { localChapterToWatchProgress } from "../../utils/convertCacheToWatchProgress";
import type { SimpleProgressCache } from "../../services/SimpleProgressCache";
import { loadCache, updateCache } from "../../services/SimpleProgressCache";
import { convertWatchProgressToCache } from "../../utils/convertCacheToWatchProgress";

import { useAppDispatch, useAppSelector } from "../../store/store";
import { 
  useGetCoursesQuery,
  useLazyGetCoursesQuery 
} from "../../store/slices/lectureApiSlice";

// 테스터 완료 임포트

import { useDispatch, useSelector } from "react-redux";
import {
  setChapters,
  setCourseTitle,
  setDuration,
  setCurrentChapterIndex,
  setStartTime,
} from "../../store/slices/progressSlice"; 

// import {
//   useGetWatchProgressAllQuery,
//   useGetWatchProgressQuery,
//   useCreateWatchProgressMutation,
//   useCreateNextVideoMutation,
//   useGetChapterProgressQuery,
// } from "../../store/slices/testApiSlice";

// import type {
//   CourseProgressResponse,
//   WatchProgress,
//   LastWatched,
//   CourseProgressStatistics,
//   Chapter,
//   PlayerState,
// } from "../../store/slices/testApiSlice";

// import {useGetCoursesQuery } from "../../store/api/courseApiSlice";


interface VideoPlayerProps {
  currentVideo: string;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onLoadedMetadata: (duration: number) => void;
  onEnded: () => void;
  onPlay: () => void; // ▶️ 재생 시작 이벤트 추가
  // onPause: () => void;
  onPause?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  startTime?: number;
  autoPlay?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentVideo,
  onTimeUpdate,
  onLoadedMetadata,
  onEnded,
  onPlay,
  onPause,
  startTime = 0,
  autoPlay = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSentTimeRef = useRef(0);

  // const [currentTime, setCurrentTime] = useState(startTime);
  const [duration, setDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [isReady, setIsReady] = useState(false);

  //tartTime 변경 감지
  // useEffect(() => {
  //   console.log(`🔄 VideoPlayer startTime 변경: ${startTime.toFixed(1)}초`);
  //   setCurrentTime(startTime);
  //   // dispatch(setCurrentTime(currentTime));
  //   setIsReady(true); // 준비 완료
  // }, [startTime]);

  // //비디오 변경 시 초기화
  // useEffect(() => {
  //   console.log(`🎬 비디오 변경: ${currentVideo}`);
  //   setCurrentTime(startTime);
  //   setDuration(0);
  //   setIsPaused(true);
  // }, [currentVideo, startTime]);

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

    // setCurrentTime(current); // UI 상태 업데이트
    // dispatch(setCurrentTime(startTime));
    const now = Date.now();
    if (now - lastSentTimeRef.current > 500) {
      // onTimeUpdate(current, video.duration); // 부모에 전달
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
      // setCurrentTime(startTime);
      console.log(`🎥 시작 지점: ${startTime.toFixed(1)}초`);
    } else {
      // setCurrentTime(0); // 명시적 초기화
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

  const handleVideoPauseUI = (e) => {
    console.log("onPause 호출됨 → isPaused = true");
    setIsPaused(true);
    if (onPause) onPause(e);
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
  const handlePlay = () => {
    console.log("🎬 비디오 재생 시작!");
    onPlay();
  };

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={`/public/video/${currentVideo}`}
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
        autoPlay={autoPlay}
        className="w-full h-full object-contain max-h-[600px]"
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
            {/* {ProgressCalculator.formatTime(currentTime)} /{" "} */}
            {/* {ProgressCalculator.formatTime(duration)} */}
          </span>

          {/* 진행률 바 */}
          <div
            className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-50"
              style={{
                width: `${duration > 0 ? (0 / duration) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const dispatch = useDispatch();

  // Redux 상태 읽기
  const chapters = useSelector((state: RootState) => state.progress.chapters);
  const currentChapterIndex = useSelector((state: RootState) => state.progress.currentChapterIndex);
  const startTime = useSelector((state: RootState) => state.progress.startTime);
  const courseTitle = useSelector((state: RootState) => state.progress.courseTitle);
  const currentTime = useSelector((state: RootState) => state.progress.currentTime);
  const hasProgressData = useSelector((state: RootState) => state.progress.hasProgressData);
  const isVideoPlaying = useSelector((state: RootState) => state.progress.isVideoPlaying);
  const lastSaveTime = useSelector((state: RootState) => state.progress.lastSaveTime);

  // 로컬 상태
  const [completedChapters, setCompletedChapters] = useState<Set<number>>(new Set());
  const [chapterProgress, setChapterProgress] = useState<Record<number, number>>({});
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set([1, 2]));
  const [realtimeCache, setRealtimeCache] = useState<Record<string, any>>({});

  // RTK Query 훅
  const { 
    data: coursesData, 
    error: coursesError, 
    isLoading: coursesLoading 
  } = useGetCoursesQuery({ page: 1, limit: 10 }, {
    skip: false // 항상 실행
  });

  const [triggerGetCourses, coursesLazyResult] = useLazyGetCoursesQuery();

  // 현재 챕터 계산
  const currentChapter = chapters?.[currentChapterIndex] ?? null;

  // RTK Query 데이터 처리
  useEffect(() => {
    if (coursesData) {
      console.log("📚 RTK Query - 코스 데이터 수신:", coursesData);
      
      // 임시 챕터 데이터 생성 (실제로는 서버에서 받아와야 함)
      const mockChapters: Chapter[] = [
        {
          id: 1,
          title: "JavaScript 기초",
          duration: "15:30",
          durationSeconds: 930,
          videoFile: "/videos/js-basics.mp4"
        },
        {
          id: 2,
          title: "변수와 자료형",
          duration: "12:45",
          durationSeconds: 765,
          videoFile: "/videos/variables.mp4"
        },
        {
          id: 3,
          title: "함수 만들기",
          duration: "18:20",
          durationSeconds: 1100,
          videoFile: "/videos/functions.mp4"
        }
      ];

      dispatch(setChapters(mockChapters));
      dispatch(setCourseTitle(`${coursesData.count}개 강의 중 선택된 코스`));
      
      // 첫 번째 챕터로 초기화
      if (currentChapterIndex === -1 && mockChapters.length > 0) {
        dispatch(setCurrentChapterIndex(0));
        dispatch(setStartTime(0));
      }
    }
  }, [coursesData, dispatch, currentChapterIndex]);

  // 에러 처리
  useEffect(() => {
    if (coursesError) {
      console.error("🔥 RTK Query 에러:", coursesError);
    }
  }, [coursesError]);

  // 수동 API 호출 함수
  const handleManualApiCall = useCallback(async () => {
    try {
      console.log("🔍 수동 RTK Query 호출 시작");
      const result = await triggerGetCourses({ page: 1, limit: 10 }).unwrap();
      console.log("✅ 수동 호출 결과:", result);
    } catch (error) {
      console.error("❌ 수동 호출 실패:", error);
    }
  }, [triggerGetCourses]);

  // 챕터 클릭 핸들러
  const handleChapterClick = useCallback((chapterId: number) => {
    const chapterIndex = chapters.findIndex((ch) => ch.id === chapterId);
    if (chapterIndex === -1) {
      console.warn("❗ 유효하지 않은 챕터 ID:", chapterId);
      return;
    }

    const selectedChapter = chapters[chapterIndex];
    console.log(`🎬 챕터 선택: ${selectedChapter.title}`);

    dispatch(setCurrentChapterIndex(chapterIndex));
    dispatch(setCurrentTime(0));
    dispatch(setStartTime(0));
    dispatch(setIsVideoPlaying(false));
  }, [chapters, dispatch]);

  // 비디오 이벤트 핸들러들
  const handleVideoPlay = useCallback(() => {
    if (!currentChapter) return;
    
    console.log(`🎬 비디오 재생 시작 - 챕터 ${currentChapter.id}`);
    dispatch(setIsVideoPlaying(true));
    dispatch(setHasProgressData(true));
  }, [currentChapter, dispatch]);

  const handleVideoPause = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget as HTMLVideoElement;
    const videoCurrentTime = video.currentTime;
    const duration = video.duration;

    if (isNaN(videoCurrentTime) || isNaN(duration) || duration <= 0) {
      console.warn("⚠️ 비디오 데이터가 유효하지 않음");
      return;
    }

    console.log("⏸️ 일시정지:", videoCurrentTime.toFixed(1), "초");
    dispatch(setIsVideoPlaying(false));
    dispatch(setCurrentTime(videoCurrentTime));
  }, [dispatch]);

  const onVideoProgress = useCallback((videoCurrentTime: number, videoDuration: number) => {
    if (!currentChapter || !isVideoPlaying) return;

    dispatch(setCurrentTime(videoCurrentTime));
    
    // 실시간 진행률 업데이트
    const progress = Math.min(videoCurrentTime, videoDuration);
    setChapterProgress((prev) => ({
      ...prev,
      [currentChapterIndex]: progress,
    }));

    // 1초마다 캐시 업데이트
    const now = Date.now();
    if (now - lastSaveTime > 1000) {
      const watchedPercentage = videoDuration > 0 ? (videoCurrentTime / videoDuration) * 100 : 0;
      
      console.log(`💾 진행률 업데이트: ${watchedPercentage.toFixed(1)}%`);
      
      // 로컬 캐시 업데이트
      setRealtimeCache((prev) => ({
        ...prev,
        [`${userId}_${currentChapter.id}`]: {
          currentTime: videoCurrentTime,
          totalDuration: videoDuration,
          watchedPercentage,
          isCompleted: watchedPercentage >= 90,
          lastUpdated: now,
          isDirty: true,
        }
      }));

      dispatch(setLastSaveTime(now));
    }
  }, [currentChapter, currentChapterIndex, isVideoPlaying, lastSaveTime, userId, dispatch]);

  const onVideoReady = useCallback((videoDuration: number) => {
    console.log(`📊 비디오 메타데이터 로드: ${videoDuration}초`);
  }, []);

  const handleVideoEnded = useCallback(() => {
    if (!currentChapter) return;
    
    console.log(`🏁 비디오 재생 완료: ${currentChapter.title}`);
    setCompletedChapters((prev) => new Set([...prev, currentChapterIndex]));
    dispatch(setIsVideoPlaying(false));

    // 다음 챕터로 자동 이동
    if (currentChapterIndex < chapters.length - 1) {
      console.log("➡️ 다음 챕터로 자동 이동");
      dispatch(setCurrentChapterIndex(currentChapterIndex + 1));
      dispatch(setCurrentTime(0));
      dispatch(setStartTime(0));
    } else {
      console.log("🎊 모든 챕터 완료!");
    }
  }, [currentChapter, currentChapterIndex, chapters.length, dispatch]);

  // 진행률 계산 함수
  const getChapterProgress = useCallback((index: number) => {
    const realTimeProgress = chapterProgress[index] || 0;
    const chapter = chapters[index];
    if (!chapter) return 0;
    
    return (realTimeProgress / chapter.durationSeconds) * 100;
  }, [chapterProgress, chapters]);

  // 로딩 상태
  if (coursesLoading) {
    return (
      <div className="flex h-screen bg-white items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">강의 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (coursesError) {
    return (
      <div className="flex h-screen bg-white items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">강의 데이터를 불러오는데 실패했습니다.</p>
          <button
            onClick={handleManualApiCall}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

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
          
          {/* 디버깅 버튼 */}
          <button
            onClick={handleManualApiCall}
            className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded"
          >
            API 다시 호출
          </button>
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
                const isCurrent = index === currentChapterIndex;
                const isCompleted = completedChapters.has(index);
                const currentProgress = getChapterProgress(index);
                const hasProgress = currentProgress > 0;

                return (
                  <button
                    key={chapter.id}
                    onClick={() => handleChapterClick(chapter.id)}
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
              <span>진행률: {currentChapter ? getChapterProgress(currentChapterIndex).toFixed(1) : 0}%</span>
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
              onPause={handleVideoPause}
              startTime={startTime}
              autoPlay
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
              전체 진행률:{" "}
              <span className="font-medium text-gray-900">
                {chapters.length > 0 
                  ? Math.round((completedChapters.size / chapters.length) * 100)
                  : 0}%
              </span>
            </div>
            <button
              onClick={() => {
                if (currentChapterIndex < chapters.length - 1) {
                  dispatch(setCurrentChapterIndex(currentChapterIndex + 1));
                  dispatch(setCurrentTime(0));
                  dispatch(setStartTime(0));
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
