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
  CourseProgressResponse,
} from "../../types/progress.types";

import type { SimpleProgressCache } from "../../services/SimpleProgressCache";
import { loadCache, updateCache } from "../../services/SimpleProgressCache";
import {
  convertWatchProgressToCache,
  localChapterToWatchProgress,
  convertServerDataToLocalCourseCache,
} from "../../utils/convertCacheToWatchProgress";

import { useGetLecturesQuery } from "../../store/slices/lectureApiSlice";

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
            {ProgressCalculator.formatTime(currentTime)} /{" "}
            {ProgressCalculator.formatTime(duration)}
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

interface Course {
  course_id: number;
  code_str: string;
  order_index: number;
  chapters: Array<{
    chapter_id: number;
    title: string;
    videos: Array<{
      video_id: number;
      title: string;
      duration: number;
    }>;
  }>;
  instructors: Array<{
    instructor_id?: number;
    name: string;
    avatar?: string;
  }>;
  title?: string; // 있으면 포함, 없으면 백엔드 수정 필요
  description?: string; // 있으면 포함
  thumbnail?: string;
  // 필요한 다른 필드도 추가
}

interface StudyLayoutPlayerProps {
  onClose: () => void;
  courseData: Course | null; //
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

const StudyLayoutPlayer: React.FC<StudyLayoutPlayerProps> = ({
  onClose,
  // courseData,
  userId = "user123",
}) => {
  //챕터 rdk
  const {
    data: lecturesData,
    isLoading: lecturesLoading,
    error: lecturesError,
    isFetching,
    isSuccess,
    isError,
  } = useGetLecturesQuery({ page: 1, limit: 10 });

  console.log("lecturesData:", lecturesData);

  //챕터  api용
  const [chapters, setChapters] = useState<Chapter[]>([]); 
  const [isChaptersLoading, setIsChaptersLoading] = useState(true);

  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  //실시간 진행률 -프로그래스바
  const [chapterProgress, setChapterProgress] = useState<
    Record<number, number>
  >({});
  const [completedChapters, setCompletedChapters] = useState<Set<number>>(
    new Set()
  );
  const [realtimeCache, setRealtimeCache] = useState<SimpleProgressCache>({});

  const [startTime, setStartTime] = useState(0);

  //"처음 시청=false,시청한 적 있음=true
  const [hasProgressData, setHasProgressData] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(0);

  // UI용 변수들
  const courseTitle =
    lecturesData?.results?.[0]?.title || "프로그래밍 기초 강의";
  const courseId = lecturesData?.results?.[0]?.course_id || 1; // 🆕 courseId 추가
  const currentChapter = chapters[currentChapterIndex];
  /// 🔥 ui에서 사용
  const totalDuration = chapters.reduce(
    (acc, chapter) => acc + chapter.durationSeconds,
    0
  );

  useEffect(() => {
    console.log("🔄 chapterProgress updated:", chapterProgress);
  }, [chapterProgress]);

  // 🔥 할당되지만 사용되지 않음
  const chapterOrder = currentChapterIndex + 1; // 챕터의 순서 (1부터)
  const chapterIndex = currentChapterIndex; // 챕터의 배열 인덱스 (0부터)

  // 🔥 비디오 정보 - 현재는 1챕터 = 1비디오 구조로 보임
  // const videoId = currentChapter.id;              // 실제 비디오 ID
  // const videoOrder = 1;                           // 해당 챕터 내 비디오 순서 (보통 1)
  // const videoIndex = 0;

  // 🔍 초기 상태 로그 (컴포넌트 렌더링 시마다 실행)
  console.log("🔍 [초기 상태 확인]");
  console.log("  📋 chapters.length:", chapters.length);
  console.log("  📋 currentChapterIndex:", currentChapterIndex);
  console.log("  📋 currentChapter:", currentChapter);
  console.log("  📋 currentChapter?.id:", currentChapter?.id);
  console.log("  📋 currentChapter?.title:", currentChapter?.title);
  console.log("  📋 userId:", userId);

  // 새사용자 정의
  const initializeEmptyState = useCallback((): void => {
    setRealtimeCache({});
    setCachedProgress({});
    setCompletedChapters(new Set());
    setChapterProgress({});
    setStartTime(0);
    setHasProgressData(false);
    console.log("🆕 빈 상태로 초기화 완료");
  }, []);

  // 🔥 사용되지 않음 - updateUIStatesFromCache에서 progressCache 설정하지만 실제 사용 안함
  const setInitialChapterStartTime = useCallback(
    (progressCache: Record<number, WatchProgress>): void => {
      console.log("🎯 [DEBUG] setInitialChapterStartTime 시작");
      console.log("🎯 [DEBUG] progressCache:", progressCache);
      console.log("🎯 [DEBUG] chapters.length:", chapters.length);

      if (chapters.length > 0) {
        const firstChapter = chapters[0];
        console.log("🎯 [DEBUG] 첫 번째 챕터:", firstChapter);

        const firstChapterProgress = progressCache[firstChapter.id];
        console.log("🎯 [DEBUG] 첫 번째 챕터 진행률:", firstChapterProgress);

        if (firstChapterProgress?.currentTime > 0) {
          console.log(
            `🎯 [DEBUG] 시작 시간 설정: ${firstChapterProgress.currentTime}초`
          );
          setStartTime(firstChapterProgress.currentTime);
          setHasProgressData(true);
        } else {
          console.log(`🎯 [DEBUG] 처음부터 시작 (진행률 없음)`);
          setStartTime(0);
          setHasProgressData(false);
        }
      } else {
        console.log("❌ [DEBUG] 챕터가 없음");
      }
    },
    [chapters]
  );

  //기존인데 이ㅣㄹ로옮기기

  const getProgressFromCache = useCallback(
    (chapterId: number): LocalChapterCache | null => {
      const currentIndex = chapters.findIndex((ch) => ch.id === chapterId);

      if (currentIndex !== -1 && chapterProgress[currentIndex] !== undefined) {
        const currentTime = chapterProgress[currentIndex];
        const chapter = chapters[currentIndex];

        return {
          currentTime,
          totalDuration: chapter.durationSeconds,
          watchedPercentage: (currentTime / chapter.durationSeconds) * 100,
          isCompleted: false,
          lastUpdated: Date.now(),
          isDirty: false,
        };
      }

      const courseId = lecturesData?.results[0]?.course_id || 1;
      const userCourseKey = `progress_${userId}_course${courseId}`;
      const courseCache = realtimeCache[userCourseKey];

      if (courseCache?.chapters?.[chapterId]) {
        return courseCache.chapters[chapterId];
      }

      return null;
    },
    [chapters, chapterProgress, realtimeCache, lecturesData, userId]
  );

  //기존로컬 캐시로드 - 백업 로드
  // useEffect(() => {
  //   const savedRealtimeCache: LocalProgressCache = loadCache();
  //   if (savedRealtimeCache && Object.keys(savedRealtimeCache).length > 0) {
  //     setRealtimeCache(savedRealtimeCache);
  //     console.log("📦 실시간 캐시 로드:", savedRealtimeCache);
  //   }

  //   // 2. ProgressTracker에서 DB 백업 데이터 로드
  //   loadExistingProgress();
  // }, [userId]);
  //컴포넌트 정리

  // 서버->로컬캐쉬->ui업로드 테스트 완료
  const updateUIStatesFromCache = useCallback(
    (cache: SimpleProgressCache): void => {
      console.log("🔄 [DEBUG] 입력 캐시:", cache);

      const legacyUserCompleted = new Set<number>();
      const legacyUserProgress: number[] = [];
      const legacyProgressCache: Record<number, WatchProgress> = {};

      const legacyCourseId = 1;
      const legacyUserCourseKey = `progress_${userId}_course${legacyCourseId}`;
      console.log("🔄 [DEBUG] 사용자 코스 키:", userCourseKey);

      // 🔹 cache에서 해당 코스 데이터 가져오기
      const legacyCourseCache = loadCache();
      console.log("🔄 [DEBUG] 코스 캐시:", legacyCourseCache);
      
      if (legacyCourseCache?.chapters) {
        console.log(
          "🔄 [DEBUG] 챕터 데이터 있음:",
          Object.keys(legacyCourseCache.chapters)
        );

        legacyCourseCache.chapterOrder.forEach((chapterId, index) => {
          const chapterData = legacyCourseCache.chapters[String(chapterId)]; // 문자열 키로 접근
          if (!chapterData) return;

          console.log(`🔄 챕터 ${chapterId} 데이터:`, chapterData);

          if (chapterData.isCompleted) {
            legacyUserCompleted.add(index);
            console.log(`✅ [DEBUG] 챕터 ${index} 완료됨`);
          }

          legacyUserProgress[index] = chapterData.currentTime || 0;
          console.log(
            `🔄 [DEBUG] 챕터 ${index} 진행 시간: ${legacyUserProgress[index]}초`
          );
        });
      } else {
        console.log("❌ [DEBUG] 코스 캐시에 챕터 데이터 없음");
      }

      setCachedProgress(legacyProgressCache);
      setCompletedChapters(legacyUserCompleted);
      // setChapterProgress(userChapterProgress);
      // setCompletedChapters(userCompletedChapters);
      // setInitialChapterStartTime(progressCache);
      if (chapters.length === 0) {
        return; // chapters 준비 안됨 - 레거시 결과만 사용
      }

      const modernChapterProgress: Record<number, number> = {};
      const modernCompletedChapters = new Set<number>();

      const modernCourseId = lecturesData?.results?.[0]?.course_id || 1;
      const modernUserCourseKey = `progress_${userId}_course${modernCourseId}`;
      const modernCourseCache = cache[modernUserCourseKey];

      if (modernCourseCache?.chapters) {
        chapters.forEach((chapter, index) => {
          const chapterData = modernCourseCache.chapters[chapter.id];

          if (chapterData) {
            modernChapterProgress[index] = chapterData.currentTime || 0;

            if (chapterData.isCompleted) {
              modernCompletedChapters.add(index);
            }
          } else {
            modernChapterProgress[index] = 0;
          }
        });

        // 모던 결과로 레거시 결과 덮어씀
        setChapterProgress(modernChapterProgress);
        setCompletedChapters(modernCompletedChapters);
      }
    },
    [userId, lecturesData?.results[0].course_id, chapters]
  );

  // 🔥 5. 기존 checkExistingChapterProgress 개선
  const checkExistingChapterProgress = useCallback(
    (chapterIndex: number) => {
      const chapter = chapters[chapterIndex];
      if (!chapter || !userId) {
        console.warn("⚠️ chapter 또는 userId 없음 — 진행률 확인 생략");
        return;
      }

      const progress = getProgressFromCache(chapter.id);

      if (
        progress &&
        typeof progress.currentTime === "number" &&
        progress.currentTime > 0
      ) {
        setHasProgressData(true);
        setStartTime(progress.currentTime); // 시작 시간도 여기서 설정
        console.log(
          `📖 기존 진행률 발견 - 챕터 ${chapter.id}: ${progress.currentTime}초부터`
        );
      } else {
        setHasProgressData(false);
        setStartTime(0);
        console.log(`📝 새 챕터 - 챕터 ${chapter.id}: 처음부터 시작`);
      }
    },
    [chapters, userId, getProgressFromCache]
  );
  
  //api용 useEffect **API 호출**: `useEffect`로 chapters 로드
  // useEffect(() => {
  //   const fetchChapters = async () => {
  //     try {
  //       const response = await fetch(
  //         `/api/courses/${lecturesData?.results[0].course_id}/chapters/`
  //       );
  //       const chaptersData = await response.json();
  //       setChapters(chaptersData);
  //       setIsChaptersLoading(false);
  //     } catch (error) {
  //       console.error("챕터 로드 실패:", error);
  //       setIsChaptersLoading(false);
  //     }
  //   };

  //   if (lecturesData?.results[0].course_id) {
  //     fetchChapters();
  //   }
  // }, [lecturesData?.results[0].course_id]);

  //RDK 챕터 로드
  // 🔄 기존 fetch useEffect를 이걸로 교체
  useEffect(() => {
    console.log("📚 RTK Query 데이터 처리 시작");
    console.log("lecturesLoading:", lecturesLoading);
    console.log("lecturesData:", lecturesData);

 
    
    if (lecturesLoading) {
      console.log("⏳ RTK Query 로딩 중...");
      setIsChaptersLoading(true);
      return;
    }

    if (lecturesError) {
      console.error("❌ RTK Query 에러:", lecturesError);
      setChapters([]);
      setIsChaptersLoading(false);
      return;
    }

    if (lecturesData?.results?.length > 0) {
      console.log("✅ RTK Query 데이터 수신:", lecturesData);

      const firstLecture = lecturesData.results[0];
      console.log("🎯 첫 번째 강의:", firstLecture);

      // 🔥 API 응답을 Chapter 형태로 변환
      // (실제 API 구조에 맞게 조정 필요)
      const apiChapters = firstLecture.lectures || firstLecture.chapters || [];

      const formattedChapters: Chapter[] = apiChapters.map(
        (item: any, index: number) => ({
          id: item.id || index + 1,
          title: item.title || `챕터 ${index + 1}`,
          time: item.time || "0:00",
          duration: item.duration || "0:05",
          durationSeconds: item.durationSeconds || item.duration_seconds || 5,
          videoFile:
            item.videoFile ||
            item.video_url ||
            item.video_file ||
            `video${index + 1}.mp4`,
          completed: false,
        })
      );

      console.log("🔄 변환된 챕터 데이터:", formattedChapters);
      //  chapters 상태 첫 대입!
      setChapters(formattedChapters);
      setIsChaptersLoading(false);

      // 🔥 강의 제목도 업데이트
      if (firstLecture.title) {
        // courseTitle 업데이트 (기존 로직 유지)
        console.log("📋 강의 제목 업데이트:", firstLecture.title);
      }
    } else {
      console.warn("⚠️ RTK Query 데이터 없음 또는 비어있음");
      setChapters([]);
      setIsChaptersLoading(false);
    }
  }, [lecturesData, lecturesLoading, lecturesError]);

  //렉쳐받아서 시청률 디비 요청 첫 로드
  // 사용자 첫로드 UI 진행률 로드 -진행률 디비 api 요청 및 컨버터
  //로컬 스토리지 관리 별도 진행
  const initializeProgress = async (courseId: number) => {
    console.log("🚀 [DEBUG] initializeProgress 시작");
    console.log("🚀 [DEBUG] userId:", userId);
    console.log("🚀 [DEBUG] courseId 매개변수:", courseId);

    if (!userId || !courseId || chapters.length === 0) {
      console.warn("⚠️ userId 또는 courseId가 없어 초기화 생략");
      return;
    }

    console.log("📚 현재 코스 ID:", courseId);

    try {
      const url = `http://localhost:8000/api/watch-progress/${userId}/${courseId}/`;
      console.log("Fetching progress from URL:", url);

      const res = await fetch(url);
      console.log("📡 [DEBUG] 서버 응답 상태:", res.status, res.ok);

      if (res.ok) {
        const serverData = await res.json();
        console.log("📡 [DEBUG] 서버에서 받은 데이터:", serverData);

        if (serverData?.chapters && serverData.chapters.length > 0) {
          console.log("📡 [DEBUG] 서버 데이터 유효함 - 변환 시작");

          const formattedCache = convertServerDataToLocalCourseCache(
            serverData,
            courseId,
            chapters
          );
          console.log("📡 [DEBUG] 변환된 로컬 캐시:", formattedCache);

          const userCourseKey = `progress_${userId}_course${courseId}`;
          //실시간 캐시:LocalProgressCache 형태로 래핑
          setRealtimeCache((prev) => ({
            ...prev,
            [userCourseKey]: formattedCache, // courseId 키 추가
          }));

          updateCache({
            ...loadCache(), // 기존 localStorage 데이터 유지
            [userCourseKey]: formattedCache,
          });

          updateUIStatesFromCache({
            ...loadCache(),
            [userCourseKey]: formattedCache,
          });

          console.log("✅ 서버 데이터로 초기화 완료");
          return;
        }
      } else {
        throw new Error(`서버 응답 에러: ${res.statusText}`);
      }
    } catch (error) {
      console.error("❌ 서버 진행률 로드 실패:", error);
    }

    // 서버 실패 시 로컬 폴백
    console.log("🔄 로컬 캐시 폴백 모드");
    try {
      const localCache = loadCache();
      console.log("🔄 [DEBUG] loadCache() 결과:", localCache);

      if (localCache && Object.keys(localCache).length > 0) {
        console.log("🔄 [DEBUG] 로컬 캐시 유효함 - UI 업데이트 시작");

        setRealtimeCache(localCache);
        updateUIStatesFromCache(localCache);
        console.log("📦 로컬 캐시로 초기화 완료");
      } else {
        console.log("📝 새 사용자 - 빈 상태로 시작");
        initializeEmptyState();
      }
    } catch (localError) {
      console.error("❌ 로컬 캐시 로드도 실패:", localError);
      initializeEmptyState();
    }
  };

  //컴포넌트 정리 끝

  //: 리팩터전 api 조회 테스트

  //api 테스트 : 초기로드
  // const loadExistingProgress = async () => {
  //   // 1. 서버에서 먼저 로드
  //   const serverData = await ProgressTracker.getCourseProgress(userId, lecturesData?.results[0].course_id || 1);

  //   // 2. 로컬 캐시와 병합
  //   if (serverData && serverData.chapters) {
  //     const formattedCache = convertWatchProgressToCache(serverData.chapters);
  //     setRealtimeCache(formattedCache);
  //     updateCache(formattedCache);
  //   }

  //   // 3. UI 상태 업데이트
  //   const progressCache: Record<number, WatchProgress> = {};
  //   const userCompletedChapters = new Set<number>();
  //   const userChapterProgress: Record<number, number> = {};

  //   chapters.forEach((chapter, index) => {
  //     const progress = getProgressFromCache(chapter.id);
  //     if (progress) {
  //       progressCache[chapter.id] = progress as WatchProgress;
  //       if (progress.isCompleted) {
  //         userCompletedChapters.add(index);
  //       }
  //       userChapterProgress[index] = progress.currentTime;
  //     }
  //   });

  //   setCachedProgress(progressCache);
  //   setCompletedChapters(userCompletedChapters);
  //   setChapterProgress(userChapterProgress);
  // };

  //로컬테스트완료: 초기 로드
  // const loadExistingProgress = () => {
  //   const progressCache: Record<number, WatchProgress> = {};
  //   const userCompletedChapters = new Set<number>();
  //   const userChapterProgress: Record<number, number> = {};

  //   chapters.forEach((chapter, index) => {
  //     // const progress = cachedProgress[chapter.id];
  //     const progress = ProgressTracker.getWatchProgress(userId, chapter.id);
  //     if (progress) {
  //       progressCache[chapter.id] = progress;
  //       if (progress.isCompleted) {
  //         userCompletedChapters.add(index);
  //       }
  //       userChapterProgress[index] = progress.currentTime;
  //     }
  //   });

  //   setCachedProgress(progressCache);
  //   setCompletedChapters(userCompletedChapters);
  //   setChapterProgress(userChapterProgress);

  //   // ✅ 새로고침 시 첫 번째 챕터의 시작 시간 설정
  //   if (chapters.length > 0) {
  //     const firstChapter = chapters[0];
  //     const firstChapterProgress = progressCache[firstChapter.id];
  //     if (firstChapterProgress?.currentTime > 0) {
  //       console.log(
  //         `🔄 [새로고침] 첫 번째 챕터 시작 시간 설정: ${firstChapterProgress.currentTime}초`
  //       );
  //       setStartTime(firstChapterProgress.currentTime);
  //     }
  //   }

  //   console.log(`📈 진행률 캐시 완료:`, progressCache);
  // };

  //1. API 조회 useEffect

  //리팩터 전
  // const checkExistingChapterProgress = (chapterIndex: number) => {
  //   const chapter = chapters[chapterIndex];
  //   if (!chapter || !userId) {
  //     console.warn("⚠️ chapter 또는 userId 없음 — 진행률 확인 생략");
  //     return;
  //   }

  //   const progress = getProgressFromCache(chapter.id);

  //   if (progress && typeof progress.currentTime === "number") {
  //     console.log(`저장시작 : ${progress.currentTime.toFixed(1)}`);
  //     setHasProgressData(true);
  //     console.log(
  //       `📖 기존 진행률 발견 - 챕터 ${chapter.id}: ${progress.currentTime}초부터`
  //     );
  //   } else {
  //     setHasProgressData(false);
  //     console.log(`📝 새 챕터 - 챕터 ${chapter.id}: 처음부터 시작`);
  //   }
  // };

  //기존 : 스토리지 -> 유즈 스테이트 -> 전역 스테이트 체크,
  // const getProgressFromCache = (chapterId: number) => {
  //   const isChashedIn = cachedProgress[chapterId]; //유즈스테이트

  //   if (isChashedIn) {
  //     console.log(`🏠 냉장고에서 발견: 챕터 ${chapterId}`);
  //     return isChashedIn;
  //   } else {
  //     console.log(`❌ 냉장고에 없음: 챕터 ${chapterId}`);
  //     return null;
  //   }
  // };

  // 🔍 기존 useEffect들에 디버깅 로그만 추가

  //디버  로그추가
  // 1. 메인 초기화 useEffect
  // 🔥 메인 초기화 useEffect
  useEffect(() => {
    if (lecturesLoading) {
      setIsChaptersLoading(true);
      return;
    } // 아직 로딩 중이면 대기

    if (lecturesError) {
      setChapters([]);
      setIsChaptersLoading(false);
      console.error("❌ 강의 목록 로드 실패:", lecturesError);
      return;
    }

    let isMounted = true; // 메모리 누수 방지

    const loadProgress = async () => {
      if (isChaptersLoading || chapters.length === 0) {
        console.log("⏳ chapters 로딩 대기 중...");
        return;
      }
      if (!isMounted) {
        console.log("❌ [DEBUG] 컴포넌트 언마운트됨 - 중단");
        return;
      }

      if (lecturesData?.results?.length > 0) {
        const firstCourse = lecturesData.results[0];
        console.log("✅ [Step 2] 진행률 초기화 실행:", {
          courseId: firstCourse.course_id,
          chaptersCount: chapters.length,
          chapterTitles: chapters.map((ch) => ch.title),
        });

        // 🔥 진행률 초기화 실행 (courseId 넘겨줌)
        await initializeProgress(firstCourse.course_id);

        // 초기화 완료 후 현재 챕터 진행률 체크
        if (isMounted && currentChapterIndex >= 0) {
          console.log(
            `📋 [DEBUG] 현재 챕터(${currentChapterIndex}) 진행률 체크 시작`
          );
          checkExistingChapterProgress(currentChapterIndex);
          console.log(
            `📋 [DEBUG] 현재 챕터(${currentChapterIndex}) 진행률 체크 완료`
          );
        } else {
          console.log(
            "📋 [DEBUG] 챕터 진행률 체크 생략 - isMounted:",
            isMounted,
            "currentChapterIndex:",
            currentChapterIndex
          );
        }
      } else {
        console.log("⚠️ 강의 데이터 없음 - 초기화 생략");
      }
    };

    loadProgress();

    return () => {
      console.log("🗑️ [DEBUG] 메인 초기화 useEffect 클린업");
      isMounted = false;
    };
  }, [
    lecturesLoading, // RTK Query 로딩 상태
    lecturesData, // RTK Query 데이터
    lecturesError, // RTK Query 에러
    isChaptersLoading, // Chapter[] 변환 로딩 상태
    chapters.length, // Chapter[] 배열 길이 (데이터 존재 여부)
    currentChapterIndex, // 현재 챕터 인덱스
  ]);

  // 2. 챕터 변경 시 진행률 체크
  useEffect(() => {
    console.log("🔄 [DEBUG] 챕터 변경 감지 useEffect 시작");
    console.log("🔄 [DEBUG] currentChapterIndex:", currentChapterIndex);

    if (currentChapterIndex >= 0) {
      console.log(`🔄 [DEBUG] 챕터 ${currentChapterIndex} 진행률 체크 시작`);
      checkExistingChapterProgress(currentChapterIndex);
      console.log(`🔄 [DEBUG] 챕터 ${currentChapterIndex} 진행률 체크 완료`);
    } else {
      console.log("🔄 [DEBUG] 유효하지 않은 챕터 인덱스 - 체크 생략");
    }
  }, [currentChapterIndex]);

  // 3. 페이지 이탈 감지
  useEffect(() => {
    console.log("🚪 [DEBUG] 페이지 이탈 감지 useEffect 등록");

    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      console.log("🚪 [DEBUG] 페이지 이탈 이벤트 발생");
      console.log("🚪 [DEBUG] hasProgressData:", hasProgressData);
      console.log("🚪 [DEBUG] currentChapter:", currentChapter?.id);
      console.log("🚪 [DEBUG] isVideoPlaying:", isVideoPlaying);

      // 🔥 NEW: 페이지 나가기 전 마지막 진행률 저장
      if (hasProgressData && currentChapter && isVideoPlaying) {
        console.log("🚪 [DEBUG] 진행률 저장 조건 만족 - 저장 시작");

        const currentProgress = getProgressFromCache(currentChapter.id);
        if (currentProgress) {
          console.log("🚪 [DEBUG] 저장할 진행률:", currentProgress);

          // 동기적 fetch 사용 (페이지 이탈 시에는 async/await 안됨)
          navigator.sendBeacon(
            "http://localhost:8000/api/watch-progress/save/",
            JSON.stringify({
              userId,
              courseId: lecturesData?.results[0].course_id || 1,
              chapterId: currentChapter.id,
              ...localChapterToWatchProgress(
                userId,
                lecturesData?.results[0].course_id || 1,
                currentChapter.id,
                currentProgress as LocalChapterCache
              ),
            })
          );
          console.log("✅ 페이지 이탈 시 진행률 저장");
        } else {
          console.log("🚪 [DEBUG] 저장할 진행률 없음");
        }
      } else {
        console.log("🚪 [DEBUG] 진행률 저장 조건 불만족");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      console.log("🗑️ [DEBUG] 페이지 이탈 감지 이벤트 제거");
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasProgressData, currentChapter, isVideoPlaying, userId]);

  // 4. 탭 전환 감지
  // useEffect(() => {
  //   console.log("👁️ [DEBUG] 탭 전환 감지 useEffect 등록");

  //   const handleVisibilityChange = () => {
  //     console.log("👁️ [DEBUG] 탭 가시성 변경 이벤트");
  //     console.log("👁️ [DEBUG] document.hidden:", document.hidden);
  //     console.log("👁️ [DEBUG] hasProgressData:", hasProgressData);
  //     console.log("👁️ [DEBUG] currentChapter:", currentChapter?.id);
  //     console.log("👁️ [DEBUG] isVideoPlaying:", isVideoPlaying);

  //     // 🔥 NEW: 탭이 숨겨질 때 진행률 저장
  //     if (
  //       document.hidden &&
  //       hasProgressData &&
  //       currentChapter &&
  //       isVideoPlaying
  //     ) {
  //       console.log("👁️ [DEBUG] 탭 숨김 조건 만족 - 진행률 저장 시작");

  //       const currentProgress = getProgressFromCache(currentChapter.id);
  //       if (currentProgress) {
  //         console.log("👁️ [DEBUG] 저장할 진행률:", currentProgress);

  //         ProgressTracker.saveProgress(
  //           userId,
  //           lecturesData?.results[0].course_id || 1,
  //           currentChapter.id,
  //           currentProgress as LocalChapterCache
  //         )
  //           .then(() => {
  //             console.log("✅ 탭 전환 시 진행률 저장 완료");
  //           })
  //           .catch((error) => {
  //             console.error("❌ [DEBUG] 탭 전환 시 저장 실패:", error);
  //           });
  //       } else {
  //         console.log("👁️ [DEBUG] 저장할 진행률 없음");
  //       }
  //     } else {
  //       console.log("👁️ [DEBUG] 탭 숨김 조건 불만족");
  //     }
  //   };

  //   document.addEventListener("visibilitychange", handleVisibilityChange);

  //   return () => {
  //     console.log("🗑️ [DEBUG] 탭 전환 감지 이벤트 제거");
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, [hasProgressData, currentChapter, isVideoPlaying, userId, lecturesData?.results[0].course_id]);

  // 5. realtimeCache 자동 저장- 로컬스토리지
  useEffect(() => {
    console.log("💾 [DEBUG] realtimeCache 변경 감지");
    console.log(
      "💾 [DEBUG] realtimeCache 키 개수:",
      Object.keys(realtimeCache).length
    );
    console.log("💾 [DEBUG] realtimeCache 내용:", realtimeCache);

    if (Object.keys(realtimeCache).length > 0) {
      console.log("💾 [DEBUG] localStorage에 저장 시작");
      updateCache(realtimeCache);
      console.log("💾 실시간 캐시 저장:", realtimeCache);
    } else {
      console.log("💾 [DEBUG] 빈 캐시라서 저장 생략");
    }
  }, [realtimeCache]);

  // 6. startTime 동기화
  useEffect(() => {
    console.log(`🔄 [DEBUG] startTime 변경 감지: ${startTime.toFixed(1)}초`);
    console.log(`🔄 [DEBUG] 이전 currentTime:`, currentTime);

    setCurrentTime(startTime);

    console.log(
      `🔄 [DEBUG] VideoPlayer startTime 변경: ${startTime.toFixed(1)}초`
    );
    console.log(`🔄 [DEBUG] setCurrentTime(${startTime}) 호출 완료`);
  }, [startTime]);

  // useEffect(() => {
  //   let isMounted = true; // 메모리 누수 방지

  //   const loadProgress = async () => {
  //     if (!isMounted) return;

  //     // 🔥 통합된 초기화 함수 호출
  //     await initializeProgress();

  //     // 초기화 완료 후 현재 챕터 진행률 체크
  //     if (isMounted && currentChapterIndex >= 0) {
  //       checkExistingChapterProgress(currentChapterIndex);
  //     }
  //   };

  //   loadProgress();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, [userId, lecturesData?.results[0].course_id]);

  // // 2. 챕터 변경 시 진행률 체크 (새로 추가)
  // useEffect(() => {
  //   if (currentChapterIndex >= 0) {
  //     checkExistingChapterProgress(currentChapterIndex);
  //   }
  // }, [currentChapterIndex]);

  // // 4. 페이지 이탈 감지 (useEffect에 추가)
  // useEffect(() => {
  //   const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
  //     // 🔥 NEW: 페이지 나가기 전 마지막 진행률 저장
  //     if (hasProgressData && currentChapter && isVideoPlaying) {
  //       const currentProgress = getProgressFromCache(currentChapter.id);
  //       if (currentProgress) {
  //         // 동기적 fetch 사용 (페이지 이탈 시에는 async/await 안됨)
  //         navigator.sendBeacon(
  //           "http://localhost:8000/api/watch-progress/save/",
  //           JSON.stringify({
  //             userId,
  //             courseId: lecturesData?.results[0].course_id || 1,
  //             chapterId: currentChapter.id,
  //             ...localChapterToWatchProgress(
  //               userId,
  //               lecturesData?.results[0].course_id || 1,
  //               currentChapter.id,
  //               currentProgress as LocalChapterCache
  //             ),
  //           })
  //         );
  //         console.log("✅ 페이지 이탈 시 진행률 저장");
  //       }
  //     }
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  // }, [hasProgressData, currentChapter, isVideoPlaying, userId, lecturesData?.results[0].course_id]);

  // // 5.탭 전환 감지 useEffect 탭 전환 감지
  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     // 🔥 NEW: 탭이 숨겨질 때 진행률 저장
  //     if (
  //       document.hidden &&
  //       hasProgressData &&
  //       currentChapter &&
  //       isVideoPlaying
  //     ) {
  //       const currentProgress = getProgressFromCache(currentChapter.id);
  //       if (currentProgress) {
  //         ProgressTracker.saveProgress(
  //           userId,
  //           lecturesData?.results[0].course_id || 1,
  //           currentChapter.id,
  //           currentProgress as LocalChapterCache
  //         ).then(() => {
  //           console.log("✅ 탭 전환 시 진행률 저장 완료");
  //         });
  //       }
  //     }
  //   };

  //   document.addEventListener("visibilitychange", handleVisibilityChange);
  //   return () =>
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  // }, [hasProgressData, currentChapter, isVideoPlaying, userId, lecturesData?.results[0].course_id]);

  // //로컬 테스트 완료
  // // useEffect(() => {
  // //   // LocalStorage 전체 구조 로드 ✅
  // //   const savedRealtimeCache: SimpleProgressCache = loadCache();
  // //   if (savedRealtimeCache && Object.keys(savedRealtimeCache).length > 0) {
  // //     setRealtimeCache(savedRealtimeCache);
  // //     console.log("📦 실시간 캐시 로드:", savedRealtimeCache);

  // //     // 현재 코스의 진행률만 확인
  // //     const userCourseKey = `progress_${userId}_course${lecturesData?.results[0].course_id || 1}`;
  // //     const currentCourseCache = savedRealtimeCache[userCourseKey];
  // //     if (currentCourseCache) {
  // //       console.log("📚 현재 코스 캐시:", currentCourseCache);
  // //     }
  // //   }

  // //   loadExistingProgress();
  // // }, [userId]);

  // // realtimeCache팔로우 저장 realtimeCache 저장 useEffect
  // useEffect(() => {
  //   if (Object.keys(realtimeCache).length > 0) {
  //     updateCache(realtimeCache);
  //     console.log("💾 실시간 캐시 저장:", realtimeCache);
  //   }
  // }, [realtimeCache]);

  // //: 리팩터전 기존초기
  // // useEffect(() => {
  // //   const savedCache = loadCache();
  // //   if (savedCache && Object.keys(savedCache).length > 0) {
  // //     setCachedProgress(savedCache);
  // //     console.log("📦 캐시 설정 완료:", savedCache);
  // //   }
  // //   // const savedCache = localStorage.getItem(STORAGE_KEY);
  // //   // console.log("✅ 로컬스토리지 불러오기:", savedCache);

  // //   // if (savedCache) {
  // //   //   const parsed = JSON.parse(savedCache);
  // //   //   setCachedProgress(parsed);
  // //   //   console.log("📦 캐시 설정 완료:", parsed);
  // //   // }

  // //   loadExistingProgress();
  // // }, [userId]);

  // // useEffect(() => {
  // //   updateCache(cachedProgress); // 분리된 함수 사용
  // //   console.log('✅ 로컬스토리지에 진행률 저장 완료:', cachedProgress);
  // // }, [cachedProgress]);

  // // useEffect(() => {
  // //   try {
  // //     const json = JSON.stringify(cachedProgress);
  // //     localStorage.setItem(STORAGE_KEY, json);
  // //     console.log("✅ 로컬스토리지에 진행률 저장 완료:", json);
  // //   } catch (error) {
  // //     console.error("❌ 로컬스토리지 저장 실패:", error);
  // //   }
  // // }, [cachedProgress]);

  // //인덱스 변경시 start타임 찾아

  // //: 리팩터전 챕터 변경 시 시작 시간 계산
  // // useEffect(() => {
  // //   if (Object.keys(cachedProgress).length > 0) {
  // //     const chapterId = chapters[currentChapterIndex]?.id;
  // //     if (chapterId && cachedProgress[chapterId]?.currentTime) {
  // //       const savedTime = cachedProgress[chapterId].currentTime;
  // //       setStartTime(savedTime);
  // //       console.log(`🎯 챕터 ${chapterId} 진행률 적용: ${savedTime}초`);
  // //     } else {
  // //       setStartTime(0);
  // //       console.log(`🎯 챕터 ${chapterId} 처음부터 시작`);
  // //     }
  // //   }
  // // }, [currentChapterIndex]);

  // //: 리팩터전 currentChapterIndex변경시 -기존 진행률 데이터 존재 확인
  // //hasProgressData 상태 업데이트
  // // useEffect(() => {
  // //   if (currentChapterIndex >= 0) {
  // //     checkExistingChapterProgress(currentChapterIndex);
  // //   }
  // // }, [currentChapterIndex]);

  // //startTime 변경되면 → currentTime도 맞춰서 업데이트  startTime 동기화 useEffect
  // useEffect(() => {
  //   console.log(`🔄 VideoPlayer startTime 변경: ${startTime.toFixed(1)}초`);
  //   setCurrentTime(startTime);
  // }, [startTime]);

  // 🎬 테스트완료 : 기존 로컬 비디오 재생 시작 시 진행률 생성
  // const handleVideoPlay = () => {
  //   console.log(`🎬 비디오 재생 시작 - 챕터 ${currentChapter.id}`);

  //   if (!hasProgressData) {
  //     console.log(
  //       `📝 새 진행률 생성: 사용자 ${userId}, 챕터 ${currentChapter.id}`
  //     );

  //     //기존
  //     const newProgress = ProgressTracker.createWatchProgress({
  //       userId,
  //       chapterId: currentChapter.id,
  //       courseId: lecturesData?.results[0].course_id || 1,
  //     });

  //     if (newProgress) {
  //       setHasProgressData(true);

  //       setCachedProgress((prev) => ({
  //         ...prev,
  //         [currentChapter.id]: newProgress,
  //       }));

  //       console.log(`✅ 진행률 생성 완료: ${newProgress.id}`);
  //     }
  //   }

  //   setIsVideoPlaying(true);
  // };

  //디비연결 테스트 : 일시정지시
  const handleVideoPlay = () => {
    console.log(`🎬 비디오 재생 시작 - 챕터 ${currentChapter.id}`);

    if (!hasProgressData) {
      console.log(
        `📝 새 진행률 생성: 사용자 ${userId}, 챕터 ${currentChapter.id}`
      );

      // 캐시에서 현재 챕터의 로컬 진행률 데이터 가져오기
      const raw = realtimeCache[currentChapter.id];

      const localChapter: LocalChapterCache = {
        currentTime: raw?.currentTime ?? 0,
        totalDuration: raw?.totalDuration ?? 0,
        watchedPercentage: raw?.watchedPercentage ?? 0,
        isCompleted: raw?.isCompleted ?? false,
        lastUpdated: raw?.lastUpdated ?? Date.now(),
        isDirty: raw?.isDirty ?? false,
      };

      setHasProgressData(true);

      // 로컬 캐시 업데이트 (realtimeCache)
      setRealtimeCache((prev) => ({
        ...prev,
        [currentChapter.id]: localChapter,
      }));

      // UI 상태 업데이트용 더미 WatchProgress 생성 (서버 저장 없이)
      const dummyProgress: WatchProgress = {
        id: `${userId}_${currentChapter.id}`, // 임시 ID
        userId,
        chapterId: currentChapter.id,
        courseId: lecturesData?.results[0].course_id || 1,
        currentTime: localChapter.currentTime,
        totalDuration: localChapter.totalDuration,
        watchedPercentage: localChapter.watchedPercentage,
        isCompleted: localChapter.isCompleted,
        totalWatchTime: localChapter.currentTime,
        sessionCount: 1,
        watchSpeed: 1,
        firstWatchedAt: new Date().toISOString(),
        lastWatchedAt: new Date().toISOString(),
        completedAt: null,
      };

      setCachedProgress((prev) => ({
        ...prev,
        [currentChapter.id]: dummyProgress,
      }));

      console.log(`✅ 로컬 진행률 생성 완료 (서버 저장 없음)`);
    }

    setIsVideoPlaying(true);
  };

  // 🎥 로컬테스트 완료: 비디오 시간 업데이트 포즈시
  //  const handleVideoPause = (e) => {
  //   const video = e.target;
  //   const currentTime = video.currentTime;
  //   const duration = video.duration;

  //   console.log("⏸️ 일시정지 시점:", currentTime);

  //   ProgressTracker.updateWatchProgress(userId, currentChapter.id, {
  //     currentTime,
  //     totalDuration: duration,
  //     watchedPercentage: (currentTime / duration) * 100,
  //     watchSpeed: 1.0,
  //   });
  // };

  //서버테스트
  const handleVideoPause = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget as HTMLVideoElement;
    const currentTime = video.currentTime;
    const duration = video.duration;

    if (isNaN(currentTime) || isNaN(duration) || duration <= 0) {
      console.warn("⚠️ 비디오 데이터가 유효하지 않음 - 저장 생략");
      return;
    }

    console.log("⏸️ 일시정지 이벤트 발생");
    console.log("  📍 현재 시간:", currentTime.toFixed(1), "초");
    console.log("  📊 전체 길이:", duration.toFixed(1), "초");
    console.log(
      "  📈 진행률:",
      ((currentTime / duration) * 100).toFixed(1),
      "%"
    );

    setIsVideoPlaying(false);

    // 1) 로컬 캐시 즉시 업데이트 (SimpleProgressCache 구조)
    // setRealtimeCache((prev) => ({
    //   ...prev,
    //   [currentChapter.id]: {
    //     currentTime,
    //     totalDuration: duration,
    //     watchedPercentage: (currentTime / duration) * 100,
    //     isCompleted: false,
    //     lastUpdated: Date.now(),
    //     isDirty: true  // 서버 동기화 필요 표시
    //   }
    // }));

    // 🔥 안전한 LocalChapterCache 객체 생성
    const safeLocalChapter: LocalChapterCache = {
      currentTime: Math.floor(currentTime),
      totalDuration: Math.floor(duration),
      watchedPercentage: Math.min(100, (currentTime / duration) * 100),
      isCompleted: currentTime / duration >= 0.9,
      lastUpdated: Date.now(),
      isDirty: true,
    };

    // 🔥 올바른 order/index 계산
    const chapterOrder = currentChapterIndex + 1; // 1, 2, 3, ...
    const chapterIndex = currentChapterIndex; // 0, 1, 2, ...
    const videoId = currentChapter.id; // 실제 비디오 ID
    const videoOrder = 1; // 챕터 내 첫 번째 비디오
    const videoIndex = 0; // 챕터 내 첫 번째 인덱스


    const currentChapterProgressTime = chapterProgress[chapterIndex] || 0;
const currentChapterDuration = currentChapter.durationSeconds || 1;
const currentChapterProgress = Math.min(
  100,
  (currentChapterProgressTime / currentChapterDuration) * 100
);


    // 🔍 전송 데이터 로깅
    console.log("📤 이어보기 저장 데이터:", {
      userId,
      courseId: lecturesData?.results[0].course_id || 1,
      chapterId: currentChapter.id,
      videoId,
      chapterOrder,
      chapterIndex,
      videoOrder,
      videoIndex,
      "현재 재생 시간": currentTime,
    });

    // 2) 서버에 저장 (ProgressTracker)
    ProgressTracker.saveProgress(
      userId,
      lecturesData?.results[0].course_id || 1,
      currentChapter.id,
      safeLocalChapter,
      chapterOrder, // 🔥 챕터 순서 (1부터)
      videoOrder, // 🔥 비디오 순서 (1부터)
      chapterIndex, // 🔥 챕터 인덱스 (0부터)
      videoIndex, // 🔥 비디오 인덱스 (0부터)
      currentChapterProgressTime,
      currentChapterProgress
    )
      .then((result) => {
        if (result) {
          console.log("✅ 서버 저장 성공:", result);
        } else {
          console.log("⚠️ 서버 저장 실패 - 로컬 캐시만 유지");
        }
      })
      .catch((error) => {
        console.error("❌ 서버 저장 중 오류:", error);
      });
  };

  // 🎥 로컬만저장 :비디오 시간 업데이트 핸들러  1초 간격으로 진행률을 업데이트(진행률 데이터가 있을 때만 저장)
  const onVideoProgress = (currentTime: number, videoDuration: number) => {
    const progress = Math.min(currentTime, videoDuration);

    console.log("🎥 [onVideoProgress] 업데이트 전:");
    console.log("  - chapterProgress 상태:", chapterProgress);
    console.log("  - 현재 챕터 인덱스:", currentChapterIndex);
    console.log("  - 현재 챕터 진행률:", chapterProgress[currentChapterIndex]);
    console.log("  - 새로운 progress 값:", progress);
    setCurrentTime(currentTime);

    setChapterProgress((prev) => ({
      ...prev,
      [currentChapterIndex]: progress, // ← UI 진행률 바 실시간 반영
    }));

    // 로컬만 저장 : 실시간 캐시 업데이트 (1초마다) -하고 내부에서 hasProgressData백업체크
    if (isVideoPlaying) {
      const now: number = Date.now();
      if (now - lastSaveTime > 1000) {
        const watchedPercentage: number =
          videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0;

        // 실시간 캐시 구조 변경 ✅
        const userCourseKey = `progress_${userId}_course${
          lecturesData?.results[0].course_id || 1
        }`;
        setRealtimeCache((prev: LocalProgressCache) => {
          // 기존 코스 데이터가 없으면 생성
          const existingCourse = prev[userCourseKey] || {
            userId,
            courseId: lecturesData?.results[0].course_id || 1,
            chapterOrder: chapters.map((ch) => ch.id),
            chapters: {},
          };

          return {
            ...prev,
            [userCourseKey]: {
              ...existingCourse,
              chapters: {
                ...existingCourse.chapters,
                [currentChapter.id]: {
                  currentTime,
                  totalDuration: videoDuration, // Optional 필드
                  watchedPercentage, // Optional 필드
                  isCompleted: ProgressCalculator.isChapterCompleted(
                    currentTime,
                    videoDuration
                  ), // Optional
                  lastUpdated: now,
                  isDirty: true,
                },
              },
            },
          };
        });

        setLastSaveTime(now);
      }
    }
    //기존 프로그레스 데이터 캐시와 트래커 혼용사용 동시체크
    // if (hasProgressData && isVideoPlaying) {
    //   const now = Date.now();
    //   if (now - lastSaveTime > 1000) {
    //     const watchedPercentage =
    //       videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0;

    //     console.log(
    //       `💾 진행률 저장: ${watchedPercentage.toFixed(
    //         1
    //       )}% (${currentTime.toFixed(1)}초)`
    //     );
    //     const updatedProgress = ProgressTracker.updateWatchProgress(
    //       userId,
    //       currentChapter.id,
    //       {
    //         currentTime,
    //         totalDuration: videoDuration,
    //         watchedPercentage,
    //         watchSpeed: 1.0,
    //       }
    //     );

    //     if (updatedProgress) {
    //       setCachedProgress((prev) => ({
    //         ...prev,
    //         [currentChapter.id]: updatedProgress,
    //       }));
    //       console.log(`🔄 캐시 업데이트: 챕터 ${currentChapter.id}`);
    //     }
    //     // if (updatedProgress) {
    //     //   setCachedProgress((prev) => ({
    //     //     ...prev,
    //     //     [currentChapter.id]: updatedProgress,
    //     //   }));
    //     //   console.log(`🔄 캐시 업데이트: 챕터 ${currentChapter.id}`);
    //     // }

    //     setLastSaveTime(now);
    //   }
    // }

    // 챕터완료 체크
    // if (ProgressCalculator.isChapterCompleted(currentTime, videoDuration)) {
    //   if (!completedChapters.has(currentChapterIndex)) {
    //     setCompletedChapters((prev) => new Set([...prev, currentChapterIndex]));

    //     if (hasProgressData) {
    //       ProgressTracker.completeChapter(userId, currentChapter.id);
    //       console.log(`🎉 챕터 완료: ${currentChapter.title}`);
    //     }
    //   }
    // }
  };

  // 🎥 기존 기능 완료 로컬 비디오 메타데이터 로드 핸들러
  // const onVideoReady = (videoDuration: number) => {
  //   // setDuration(videoDuration);
  //   console.log(`📊 비디오 메타데이터 로드: ${videoDuration}초`);
  //   if (hasProgressData) {
  //     ProgressTracker.updateWatchProgress(userId, currentChapter.id, {
  //       totalDuration: videoDuration,
  //     });
  //   }
  // };

  // 🎥 비디오 메타데이터 로드 핸들러
  const onVideoReady = (videoDuration: number) => {
    console.log(`📊 비디오 메타데이터 로드: ${videoDuration}초`);
    if (isNaN(videoDuration) || videoDuration <= 0) {
      console.warn("⚠️ 비디오 길이가 유효하지 않음 - 저장 생략");
      return;
    }

    if (hasProgressData) {
      // realtimeCache 업데이트 (useEffect가 자동으로 로컬 저장)
      // setRealtimeCache(prev => ({
      //   ...prev,
      //   [currentChapter.id]: {
      //     ...prev[currentChapter.id],
      //     totalDuration: videoDuration,
      //   }
      // }));

      // 🔥 안전한 LocalChapterCache 객체 생성
      const safeLocalChapter: LocalChapterCache = {
        currentTime: Math.floor(currentTime), // 현재 재생 시간
        totalDuration: Math.floor(videoDuration), // 비디오 전체 길이
        watchedPercentage:
          videoDuration > 0
            ? Math.min(100, (currentTime / videoDuration) * 100)
            : 0,
        isCompleted: false, // 메타데이터 로드 시점에는 완료 아님
        lastUpdated: Date.now(), // ✅ 현재 타임스탬프
      };

      // ProgressTracker.saveProgress(
      //   userId,
      //   lecturesData?.results[0].course_id || 1,
      //   currentChapter.id,
      //   safeLocalChapter // ✅ 검증된 데이터 전달
      // )
      //   .then((result) => {
      //     if (result) {
      //       console.log("✅ 메타데이터 서버 저장 성공:", result);
      //     } else {
      //       console.log("⚠️ 메타데이터 서버 저장 실패");
      //     }
      //   })
      //   .catch((error) => {
      //     console.error("❌ 메타데이터 서버 저장 중 오류:", error);
      //   });
    }
  };

  // 🎥 비디오 끝남 핸들러
  // const handleVideoEnded = () => {
  //   console.log(`🏁 비디오 재생 완료: ${currentChapter.title}`);
  //   setCompletedChapters((prev) => new Set([...prev, currentChapterIndex]));
  //   setIsVideoPlaying(false);

  //   if (hasProgressData) {
  //     ProgressTracker.completeChapter(
  //       userId,
  //       currentChapter.id,
  //       currentChapter.id
  //     );
  //     const summary = ProgressTracker.getUserProgressSummary(userId, courseId);
  //     setProgressSummary(summary);
  //     // setProgressSummary(summary);
  //   }

  //   if (currentChapterIndex < chapters.length - 1) {
  //     console.log(
  //       `➡️ 다음 챕터로 자동 이동: ${chapters[currentChapterIndex + 1].title}`
  //     );
  //     setCurrentTime(0);
  //     setDuration(0);
  //     setCurrentChapterIndex(currentChapterIndex + 1);
  //   } else {
  //     console.log(`🎊 모든 챕터 완료!`);
  //   }
  // };

   const handleVideoEnded = async() => {
    if (hasProgressData && currentChapter) {
      const videoDuration = currentChapter.durationSeconds || 1;
      
      // 완료된 챕터의 최종 진행률 저장 (100%)
      const completedProgress: LocalChapterCache = {
        currentTime: videoDuration,
        totalDuration: videoDuration,
        watchedPercentage: 100,
        isCompleted: true,
        lastUpdated: Date.now(),
        isDirty: true,
      };
  
      // 서버에 완료 상태 저장
      try {
        const chapterOrder = currentChapterIndex + 1;
        const videoOrder = 1;
        const chapterIndex = currentChapterIndex;
        const videoIndex = 0;
        const currentChapterProgressTime = videoDuration;
        const currentChapterProgress = 100;
  
        await ProgressTracker.saveProgress(
          userId,
          lecturesData?.results[0].course_id || 1,
          currentChapter.id,
          completedProgress,
          chapterOrder,
          videoOrder,
          chapterIndex,
          videoIndex,
          currentChapterProgressTime,
          currentChapterProgress
        );
        
        // 로컬 UI 상태도 업데이트
        setChapterProgress((prev) => ({
          ...prev,
          [currentChapterIndex]: videoDuration,
        }));
  
        console.log("✅ 챕터 완료 저장 성공");
      } catch (error) {
        console.error("❌ 챕터 완료 저장 실패:", error);
      }
  
      // 전체 진행률 요약 업데이트
      try {
        const summary = ProgressTracker.getUserProgressSummary(userId, courseId);
        setProgressSummary(summary);
      } catch (error) {
        console.error("❌ 진행률 요약 업데이트 실패:", error);
      }
    }
  
    // 🔥 자동 다음 영상 재생 로직
    if (currentChapterIndex < chapters.length - 1) {
      const nextChapterIndex = currentChapterIndex + 1;
      const nextChapter = chapters[nextChapterIndex];
      
      console.log(`➡️ 자동 다음 챕터 재생: ${nextChapter.title}`);
      
      // 3초 후 자동 재생 (사용자가 취소할 수 있도록)
      const autoPlayDelay = 3000;
      let countdownTimer: NodeJS.Timeout;
      
      // 카운트다운 표시 (옵션)
      console.log(`⏰ ${autoPlayDelay/1000}초 후 다음 영상이 자동 재생됩니다...`);
      
      countdownTimer = setTimeout(() => {
        // 다음 챕터로 이동
        setCurrentChapterIndex(nextChapterIndex);
        setCurrentTime(0);
        setStartTime(0); // 다음 영상은 처음부터 시작
        setIsVideoPlaying(false); // VideoPlayer가 자동으로 재생 시작
        
        console.log(`🎬 다음 챕터 자동 재생 시작: ${nextChapter.title}`);
      }, autoPlayDelay);
  
      // 사용자가 수동으로 챕터를 변경하면 자동재생 취소
      return () => {
        if (countdownTimer) {
          clearTimeout(countdownTimer);
          console.log("⏹️ 자동 재생 취소됨");
        }
      };
      
    } else {
      // 마지막 영상 완료
      console.log(`🎊 모든 챕터 완료! 수고하셨습니다.`);
      
      // 전체 코스 완료 처리 (옵션)
      try {
        // 코스 완료 상태를 서버에 저장하는 로직 추가 가능
        console.log("🏆 전체 코스 학습 완료!");
      } catch (error) {
        console.error("❌ 코스 완료 처리 실패:", error);
      }
    }
  };

  // 로컬테스트 완료 : 챕터 이동 클릭 핸들러
  // const handleChapterClick = (chapterId: number) => {
  //   // saveProgressToLocalStorage();

  //   const chapterIndex = chapters.findIndex((ch) => ch.id === chapterId);

  //   if (chapterIndex === -1) {
  //     console.warn("❗ 유효하지 않은 챕터 ID:", chapterId);
  //     return;
  //   }

  //   const selectedChapter = chapters[chapterIndex];
  //   console.log(`🎬 챕터 선택: ${selectedChapter.title}`);

  //   //useEffect트리커 챕터변경감지
  //   setCurrentChapterIndex(chapterIndex);
  //   setCurrentTime(0);
  //   setIsVideoPlaying(false);
  // };
  // 2.api 테스트 챕터 변경 - 이전 챕터 진행률 저장
  const handleChapterClick = async (chapterId: number) => {
    // 🔥 NEW: 현재 챕터의 진행률을 서버에 저장
    if (hasProgressData && currentChapter) {
      const currentProgress = getProgressFromCache(currentChapter.id);
      if (currentProgress) {
        await ProgressTracker.saveProgress(
          userId,
          lecturesData?.results[0].course_id || 1,
          currentChapter.id,
          currentProgress as LocalChapterCache
        );
        console.log("✅ 챕터 변경 전 진행률 저장 완료");
      }
    }

    const chapterIndex = chapters.findIndex((ch) => ch.id === chapterId);
    if (chapterIndex === -1) {
      console.warn("❗ 유효하지 않은 챕터 ID:", chapterId);
      return;
    }

    const selectedChapter = chapters[chapterIndex];
    console.log(`🎬 챕터 선택: ${selectedChapter.title}`);

    setCurrentChapterIndex(chapterIndex);
    setCurrentTime(0);
    setIsVideoPlaying(false);
  };

  // const saveProgressToLocalStorage = () => {
  //   try {
  //     const json = JSON.stringify(cachedProgress);
  //     localStorage.setItem(STORAGE_KEY, json);
  //     console.log("💾 저장됨:", json);
  //   } catch (error) {
  //     console.error("❌ 저장 실패:", error);
  //   }
  // };

  //  테스트 진행률 초기화

  // 🔥 UI에서 호출되지 않음
  const handleResetProgress = () => {
    if (confirm("모든 학습 진행률을 초기화하시겠습니까?")) {
      ProgressTracker.clearAllUserData(userId);

      // 상태 초기화
      setCompletedChapters(new Set());
      setChapterProgress({});
      setProgressSummary(null);
      setCurrentChapterIndex(0);
      setStartTime(0);
      setHasProgressData(false);
      setIsVideoPlaying(false);
      setLastSaveTime(0);

      console.log(`🔄 진행률 초기화 완료`);
    }
  };

  // 6. 5분 체크포인트 저장 (기존 주기적 저장에 추가)
  let lastCheckpointTime = 0;

  //사용되지 않음 - 체크포인트 로직이 주석처리됨
  const saveCheckpoint = () => {
    const now = Date.now();
    if (now - lastCheckpointTime > 300000) {
      // 5분 = 300000ms
      if (hasProgressData && currentChapter && isVideoPlaying) {
        const currentProgress = getProgressFromCache(currentChapter.id);
        if (currentProgress) {
          ProgressTracker.saveProgress(
            userId,
            lecturesData?.results[0].course_id || 1,
            currentChapter.id,
            currentProgress as LocalChapterCache
          ).then(() => {
            console.log("✅ 5분 체크포인트 저장 완료");
            lastCheckpointTime = now;
          });
        }
      }
    }
  };

  // onVideoProgress 내부에 체크포인트 저장 추가
  // if (now - lastSaveTime > 1000) {
  //   // 기존 로컬 캐시 업데이트 코드...

  //   // 🔥 NEW: 5분 체크포인트 확인
  //   saveCheckpoint();

  //   setLastSaveTime(now);
  // }
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
                {lecturesData?.results?.[0]?.title || courseTitle}
              </span>
            </div>
            {/*진행률  */}
            {chapters.map((chapter, index) => {
              const isCurrent = index === currentChapterIndex; // ID 대신 인덱스 비교
              const duration = chapter.durationSeconds || 1;
              const currentTime = chapterProgress[index] || 0; // 인덱스로 접근
              const currentProgress = Math.min(
                100,
                (currentTime / duration) * 100
              );
              const isCompleted = completedChapters.has(index); // 인덱스로 확인

              console.log(`🎨 [Render] 챕터 ${index}:`, {
                title: chapter.title,
                isCurrent,
                currentTime,
                currentProgress,
                isCompleted,
              });
              console.log(`챕터 ${index} 상세:`, {
                title: chapter.title,
                currentTime,
                duration: duration,
                durationFromChapter: chapter.durationSeconds,
                durationString: chapter.duration,
                progress: currentProgress,
                // 비디오 실제 길이도 확인
                expectedProgress: "5초면 몇%여야 하는지",
              });

              return (
                <button
                  key={chapter.id}
                  onClick={() => handleChapterClick(chapter.id)} // ID로 호출
                  className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-colors ${
                    isCurrent
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isCurrent
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      index + 1
                    )}
                  </div>

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

                    <div className="mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-yellow-400 h-1 rounded-full transition-all duration-300"
                          style={{
                            width: `${currentProgress}%`,
                          }}
                        />
                      </div>
                      {/* 디버깅용 진행률 표시 */}
                      <div className="text-xs text-gray-500 mt-1">
                        {currentProgress.toFixed(1)}% ({currentTime.toFixed(1)}
                        s)
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
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
              onPause={handleVideoPause}
              startTime={startTime}
              autoPlay={true}
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
