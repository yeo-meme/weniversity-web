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
// import {
//   loadProgressFromServer,
//   setCurrentChapterIndex,
//   setChapterAndTime,
//   selectCurrentChapterIndex,
//   selectStartTime,
//   selectChapterLoading,
//   selectChapterInitialized,
// } from "../../store/slices/chapterSlice";

// 테스터 완료 임포트

import { useDispatch, useSelector } from 'react-redux';
import {
  setChapters,
  setCourseTitle,
  setIsInitialized,
  setCurrentChapterIndex,
  setCurrentTime,        // 🔥 추가
  setHasProgressData, 
} from '../../store/slices/playerSlice';
import { useGetWatchProgressQuery } from '../../store/slices/testApiSlice';




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
  useEffect(() => {
    console.log(`🔄 VideoPlayer startTime 변경: ${startTime.toFixed(1)}초`);
    setCurrentTime(startTime);
    // dispatch(setCurrentTime(currentTime));
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

    // setCurrentTime(current); // UI 상태 업데이트
    // dispatch(setCurrentTime(startTime)); 
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
                width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
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
  //------테스트 성공
  const dispatch = useDispatch();

  const videoId = 1;
  
  const { data, error, isLoading } = useGetWatchProgressQuery({
    userId: 'abc123',
    videoId: 10
  });
  // 2. API 데이터가 들어오면 리덕스 상태 업데이트
  useEffect(() => {
    if (data) {
      // 🔥 API 응답 구조 상세 로깅
      console.log('=== API Response Debug ===');
      console.log('Full API Response:', data);
      console.log('Response Type:', typeof data);
      console.log('Response Keys:', Object.keys(data));
  
      // 🔥 chapters 배열 상세 확인
      console.log('=== Chapters Debug ===');
      console.log('Chapters Array:', data.chapters);
      console.log('Chapters Type:', typeof data.chapters);
      console.log('Chapters Length:', data.chapters?.length);
      console.log('Is Array?:', Array.isArray(data.chapters));
  
      if (data.chapters && data.chapters.length > 0) {
        console.log('First Chapter Sample:', data.chapters[0]);
        console.log('First Chapter Keys:', Object.keys(data.chapters[0]));
  
        const firstChapter = data.chapters[0];
        console.log('=== WatchProgress Structure Check ===');
        console.log('userId:', firstChapter.userId);
        console.log('courseId:', firstChapter.courseId);
        console.log('chapterId:', firstChapter.chapterId);
        console.log('videoId:', firstChapter.videoId);
        console.log('chapterIndex:', firstChapter.chapterIndex);
        console.log('videoIndex:', firstChapter.videoIndex);
        console.log('currentTime:', firstChapter.currentTime);
        console.log('totalDuration:', firstChapter.totalDuration);
        console.log('watchedPercentage:', firstChapter.watchedPercentage);
        console.log('isCompleted:', firstChapter.isCompleted);
      }
  
      // 🔥 lastWatched 구조 확인
      console.log('=== LastWatched Debug ===');
      console.log('LastWatched:', data.lastWatched);
      if (data.lastWatched) {
        console.log('LastWatched Keys:', Object.keys(data.lastWatched));
        console.log('lastChapterId:', data.lastWatched.lastChapterId);
        console.log('lastVideoId:', data.lastWatched.lastVideoId);
        console.log('lastChapterIndex:', data.lastWatched.lastChapterIndex);
        console.log('lastVideoIndex:', data.lastWatched.lastVideoIndex);
      }
  
      // 🔥 statistics 구조 확인
      console.log('=== Statistics Debug ===');
      console.log('Statistics:', data.statistics);
      if (data.statistics) {
        console.log('Statistics Keys:', Object.keys(data.statistics));
        console.log('totalChapters:', data.statistics.totalChapters);
        console.log('completedChapters:', data.statistics.completedChapters);
        console.log('totalVideos:', data.statistics.totalVideos);
        console.log('completedVideos:', data.statistics.completedVideos);
        console.log('overallProgress:', data.statistics.overallProgress);
        console.log('isCompleted:', data.statistics.isCompleted);
      }
  
      // 🔥 CourseProgressResponse 인터페이스 호환성 체크
      console.log('=== Interface Compatibility Check ===');
      const hasRequiredFields = {
        userId: !!data.userId,
        courseId: !!data.courseId,
        chapters: Array.isArray(data.chapters),
        lastWatched: data.lastWatched !== undefined,
        statistics: !!data.statistics
      };
      console.log('CourseProgressResponse 필드 존재 여부:', hasRequiredFields);
  
      const allFieldsPresent = Object.values(hasRequiredFields).every(Boolean);
      console.log('모든 필수 필드 존재?:', allFieldsPresent);
  
      // 전체 강의 제목, 챕터 목록, 총 재생시간 등 상태 저장
      dispatch(setCourseTitle(`강의 ${data.courseId} 제목`));
      dispatch(setChapters(data.chapters));
      // dispatch(setDuration(data.chapters.reduce((acc, ch) => acc + ch.totalDuration, 0)));
  
      // 마지막 시청 위치 설정
      if (data.lastWatched) {
        // dispatch(setCurrentChapterIndex(data.lastWatched.lastChapterIndex || 0));
        // dispatch(setStartTime(data.lastWatched.currentTime || 0));
      } else {
        // dispatch(setCurrentChapterIndex(0));
        // dispatch(setStartTime(0));
      }
    }
  }, [data, dispatch]);
  
  // 3. 리덕스 상태에서 데이터 읽기 (변수명 유니크하게 변경)
  const progressChapters = useSelector((state) => state.player.chapters);
  const progressChapterIndex = useSelector((state) => state.player.currentChapterIndex);
  const progressStartTime = useSelector((state) => state.player.startTime);
  const progressCourseTitle = useSelector((state) => state.player.courseTitle);
  const progressCurrentTime = useSelector(state => state.player.currentTime);


  // 리덕스 상태 확인용 로그
  
 
  // 🔥 Redux Progress State (progress_ 접두사로 통일)
  const progress_currentTime = useSelector(state => state.player.currentTime);
  const progress_currentVideoIndex = useSelector(state => state.player.currentVideoIndex);
  const progress_isInitialized = useSelector(state => state.player.isInitialized);
  const progress_hasProgressData = useSelector(state => state.player.hasProgressData);
  const progress_isVideoPlaying = useSelector(state => state.player.isVideoPlaying);
  const progress_lastSaveTime = useSelector(state => state.player.lastSaveTime);

  // 🔴 기존 useState들 (아직 Redux로 변경 안한 것들)
  // const [cachedProgress, setCachedProgress] = useState<Record<number, WatchProgress>>({});
  // const [realtimeCache, setRealtimeCache] = useState<SimpleProgressCache>({});
  // const [duration, setDuration] = useState(0);
  // const [completedChapters, setCompletedChapters] = useState(new Set<number>());
  // const [chapterProgress, setChapterProgress] = useState<Record<number, number>>({});
  // const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set([1, 2]));

  
  console.log('Progress Chapters:', progressChapters);
  console.log('Progress Chapter Index:', progressChapterIndex);
  console.log('Progress Start Time:', progressStartTime);
  console.log('Progress Course Title:', progressCourseTitle);
  console.log('Progress progressCurrentTime:', progressCurrentTime);
  
  // 현재 챕터
  const progressCurrentChapter = progressChapters[progressChapterIndex] ?? null;

  //------테스트 성공 


  //DB 백업 캐시
  const [cachedProgress, setCachedProgress] = useState<
    Record<number, WatchProgress>
  >({});
  const [realtimeCache, setRealtimeCache] = useState<SimpleProgressCache>({});

  // const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  // const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [completedChapters, setCompletedChapters] = useState(new Set<number>());

  //실시간 진행률 -프로그래스바
  const [chapterProgress, setChapterProgress] = useState<
    Record<number, number>
  >({});
  // const [startTime, setStartTime] = useState(0);

  //"처음 시청=false,시청한 적 있음=true
  // const [hasProgressData, setHasProgressData] = useState(false);
  // const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  // const [lastSaveTime, setLastSaveTime] = useState(0);

  // 새 UI용 상태
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(
    new Set([1, 2])
  );

  // UI용 변수들

  const currentChapterIndexRe = 2;
  const courseTitle = courseData?.title || "프로그래밍 기초 강의";
  const currentChapter = chapters[currentChapterIndexRe];
  const totalDuration = chapters.reduce(
    (acc, chapter) => acc + chapter.durationSeconds,
    0
  );

  // 🔍 초기 상태 로그 (컴포넌트 렌더링 시마다 실행)
  console.log("🔍 [초기 상태 확인]");
  console.log("  📋 chapters.length:", chapters.length);
  // console.log("  📋 currentChapterIndex:", currentChapterIndex);
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

  // 🔥 1. 빈 상태 초기화
  const initializeEmptyState = useCallback((): void => {
    setRealtimeCache({});
    setCachedProgress({});
    setCompletedChapters(new Set());
    setChapterProgress({});
    setStartTime(0);
    
    // 🔥 Redux 액션 사용
    // dispatch(setHasProgressData(false));
    
    console.log("🆕 빈 상태로 초기화 완료");
  }, [dispatch]); // dispatch 의존성 추가

  // 🔥 2. 첫 번째 챕터 시작 시간 설정
  const setInitialChapterStartTime = useCallback(
    (progressCache: Record<number, WatchProgress>): void => {
      console.log("🎯 [DEBUG] setInitialChapterStartTime 시작");
      
      if (chapters.length > 0) {
        const firstChapter = chapters[0];
        const firstChapterProgress = progressCache[firstChapter.id];
  
        if (firstChapterProgress?.currentTime > 0) {
          console.log(`🎯 [DEBUG] 시작 시간 설정: ${firstChapterProgress.currentTime}초`);
          setStartTime(firstChapterProgress.currentTime);
          
          // 🔥 Redux 액션 사용
          dispatch(setHasProgressData(true));
        } else {
          console.log(`🎯 [DEBUG] 처음부터 시작 (진행률 없음)`);
          setStartTime(0);
          
          // 🔥 Redux 액션 사용
          dispatch(setHasProgressData(false));
        }
      }
    },
    [chapters, dispatch] // dispatch 의존성 추가
  );

  //기존인데 이ㅣㄹ로옮기기

  const getProgressFromCache = (
    chapterId: number
  ): LocalChapterCache | WatchProgress | null => {
    const currentIndex = chapters.findIndex((ch) => ch.id === chapterId);
    if (currentIndex !== -1 && chapterProgress[currentIndex]) {
      const currentTime = chapterProgress[currentIndex];
      const chapter = chapters[currentIndex];

      // CacheEntry 타입변환
      const realtimeProgress: LocalChapterCache = {
        currentTime,
        totalDuration: chapter.durationSeconds, // Optional이므로 있으면 추가
        watchedPercentage: (currentTime / chapter.durationSeconds) * 100, // Optional
        isCompleted: false, // Optional
        lastUpdated: Date.now(),
        isDirty: false,
      };

      console.log(
        `🎮 현재 재생 중 진행률: 챕터 ${chapterId} - ${currentTime}초`
      );
      return realtimeProgress;
    }

    // 1️⃣ 실시간 캐시 확인 - 구조 변경 ✅
    const userCourseKey = `progress_${userId}_course${courseData?.id || 1}`;
    const courseCache = realtimeCache[userCourseKey];
    if (courseCache?.chapters?.[chapterId]) {
      const chapterData = courseCache.chapters[chapterId];
      console.log(`⚡ 실시간 캐시에서 발견: 챕터 ${chapterId}`);
      return chapterData;
    }

    // 2DB 캐시 확인 (ProgressTracker)
    const dbCached = cachedProgress[chapterId];
    if (dbCached) {
      console.log(`💾 DB 캐시에서 발견: 챕터 ${chapterId}`);
      return dbCached;
    }

    console.log(`❌ 캐시에 없음: 챕터 ${chapterId}`);
    return null;
  };

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
  // 🔥 3 UI 상태 업데이트 함수들 (컴포넌트 내부에 추가)
  const updateUIStatesFromCache = useCallback(
    (cache: SimpleProgressCache): void => {
      console.log("🔄 [DEBUG] updateUIStatesFromCache 시작");
      console.log("🔄 [DEBUG] 입력 캐시:", cache);

      const progressCache: Record<number, WatchProgress> = {};
      const userCompletedChapters = new Set<number>();
      const userChapterProgress: Record<number, number> = {};

      const userCourseKey = `progress_${userId}_course${courseData?.id || 1}`;
      console.log("🔄 [DEBUG] 사용자 코스 키:", userCourseKey);

      const courseCache = cache[userCourseKey];
      console.log("🔄 [DEBUG] 코스 캐시:", courseCache);

      if (courseCache?.chapters) {
        console.log(
          "🔄 [DEBUG] 챕터 데이터 있음:",
          Object.keys(courseCache.chapters)
        );

        chapters.forEach((chapter, index) => {
          const chapterData = courseCache.chapters[chapter.id];
          console.log(
            `🔄 [DEBUG] 챕터 ${chapter.id} (${index}) 데이터:`,
            chapterData
          );

          if (chapterData) {
            const watchProgress: WatchProgress = {
              id: `${userId}_${chapter.id}`,
              userId,
              chapterId: chapter.id,
              courseId: courseData?.id || 1,
              currentTime: chapterData.currentTime,
              totalDuration: chapterData.totalDuration || 0,
              watchedPercentage: chapterData.watchedPercentage || 0,
              isCompleted: chapterData.isCompleted || false,
              totalWatchTime: chapterData.currentTime,
              sessionCount: 1,
              watchSpeed: 1,
              firstWatchedAt: new Date(
                chapterData.lastUpdated || Date.now()
              ).toISOString(),
              lastWatchedAt: new Date(
                chapterData.lastUpdated || Date.now()
              ).toISOString(),
              completedAt: chapterData.isCompleted
                ? new Date().toISOString()
                : null,
            };

            console.log(
              `🔄 [DEBUG] 챕터 ${chapter.id} 진행률: ${chapterData.currentTime}초`
            );

            progressCache[chapter.id] = watchProgress;

            if (chapterData.isCompleted) {
              userCompletedChapters.add(index);
              console.log(`✅ [DEBUG] 챕터 ${index} 완료됨`);
            }

            userChapterProgress[index] = chapterData.currentTime;
          }
        });
      } else {
        console.log("❌ [DEBUG] 코스 캐시에 챕터 데이터 없음");
      }

      console.log("🔄 [DEBUG] 최종 progressCache:", progressCache);
      console.log("🔄 [DEBUG] 최종 userChapterProgress:", userChapterProgress);

      setCachedProgress(progressCache);
      setCompletedChapters(userCompletedChapters);
      setChapterProgress(userChapterProgress);
      setCompletedChapters(userCompletedChapters);
      setInitialChapterStartTime(progressCache);

      console.log("✅ [DEBUG] updateUIStatesFromCache 완료");
    },
    [userId, courseData?.id, chapters, setInitialChapterStartTime]
  );
  // 🔥 5. 기존 checkExistingChapterProgress 개선
  // const checkExistingChapterProgress = useCallback(
  //   (chapterIndex: number) => {
  //     const chapter = chapters[chapterIndex];
  //     if (!chapter || !userId) {
  //       console.warn("⚠️ chapter 또는 userId 없음 — 진행률 확인 생략");
  //       return;
  //     }

  //     const progress = getProgressFromCache(chapter.id);

  //     if (
  //       progress &&
  //       typeof progress.currentTime === "number" &&
  //       progress.currentTime > 0
  //     ) {
  //       setHasProgressData(true);
  //       setStartTime(progress.currentTime); // 시작 시간도 여기서 설정
  //       console.log(
  //         `📖 기존 진행률 발견 - 챕터 ${chapter.id}: ${progress.currentTime}초부터`
  //       );
  //     } else {
  //       setHasProgressData(false);
  //       setStartTime(0);
  //       console.log(`📝 새 챕터 - 챕터 ${chapter.id}: 처음부터 시작`);
  //     }
  //   },
  //   [chapters, userId, getProgressFromCache]
  // );

  //-----------리덕스 추가
  // 🔥 서버에서 마지막 시청 정보 로드 및 초기화
  // useEffect(() => {
  //   if (!userId || !courseData?.id || !chapters?.length) {
  //     console.warn("⚠️ 필수 데이터 누락 - 초기화 대기 중:", {
  //       userId: !!userId,
  //       courseId: !!courseData?.id,
  //       chaptersLength: chapters?.length
  //     });
  //     return;
  //   }
  
  //   console.log("🚀 Redux: 전체 진행률 초기화 시작");
  
  //   dispatch(
  //     loadProgressFromServer({
  //       userId,
  //       courseId: courseData.id,
  //     })
  //   ).then((result) => {
  //     if (loadProgressFromServer.fulfilled.match(result)) {
  //       const { success, serverData, lastWatched } = result.payload;
        
  //       console.log("📡 서버 응답 데이터:", { success, lastWatched });
        
  //       // 1️⃣ 서버 데이터로 로컬 캐시 업데이트 (기존과 동일)
  //       if (serverData?.chapters) {
  //         try {
  //           console.log("📡 [DEBUG] 서버 데이터 유효함 - 변환 시작");
            
  //           const formattedCache = convertWatchProgressToCache(serverData.chapters);
  //           console.log("📡 [DEBUG] 변환된 캐시:", formattedCache);
            
  //           setRealtimeCache(formattedCache);
  //           updateCache(formattedCache); // 로컬스토리지 저장
  //           updateUIStatesFromCache(formattedCache); // UI 상태 업데이트
            
  //           console.log("✅ 서버 데이터로 로컬 캐시 동기화 완료");
  //         } catch (error) {
  //           console.error("❌ 서버 데이터 변환 실패:", error);
  //         }
  //       }
        
  //       // 2️⃣ 마지막 시청 위치 복원 (기존과 동일)
  //       if (lastWatched.found && lastWatched.chapterId) {
  //         const chapterIndex = chapters.findIndex(ch => ch.id === lastWatched.chapterId);
          
  //         if (chapterIndex !== -1) {
  //           console.log(`✅ 마지막 시청 위치 복원: 챕터 ${chapterIndex}, 시간 ${lastWatched.currentTime}초`);
            
  //           setCurrentChapterIndex(chapterIndex);
  //           setStartTime(lastWatched.currentTime);
  //           // setCurrentTime(lastWatched.currentTime);
  //           dispatch(setCurrentTime(lastWatched.currentTime));
  //           dispatch(setCurrentTime(0));
  //           if (lastWatched.currentTime > 0) {
  //             setHasProgressData(true);
  //           }
  //         } else {
  //           console.warn(`⚠️ 챕터 ID ${lastWatched.chapterId}를 찾을 수 없음`);
  //           setCurrentChapterIndex(0);
  //           setStartTime(0);
  //         }
  //       } else {
  //         console.log("📝 새 사용자 - 첫 번째 챕터부터 시작");
  //         setCurrentChapterIndex(0);
  //         setStartTime(0);
  //       }
        
  //     } else {
  //       // 3️⃣ 서버 실패 시 로컬 캐시 폴백 (기존과 동일)
  //       console.error("❌ Redux 서버 로드 실패 - 로컬 캐시 폴백");
        
  //       try {
  //         console.log("🔄 로컬 캐시 폴백 모드");
  //         const localCache = loadCache();
  //         console.log("🔄 [DEBUG] loadCache() 결과:", localCache);
          
  //         if (localCache && Object.keys(localCache).length > 0) {
  //           console.log("🔄 [DEBUG] 로컬 캐시 유효함 - UI 업데이트 시작");
  //           setRealtimeCache(localCache);
  //           updateUIStatesFromCache(localCache);
  //           console.log("📦 로컬 캐시로 복구 완료");
  //         } else {
  //           console.log("📝 로컬 캐시도 없음 - 빈 상태로 시작");
  //           initializeEmptyState();
  //         }
  //       } catch (error) {
  //         console.error("❌ 로컬 캐시 로드도 실패:", error);
  //         initializeEmptyState();
  //       }
        
  //       // 기본값으로 설정
  //       setCurrentChapterIndex(0);
  //       setStartTime(0);
  //     }
      
  //     console.log("🏁 Redux 전체 초기화 완료");
  //   }).catch((error) => {
  //     console.error("❌ Redux 초기화 중 예외:", error);
      
  //     // 예외 발생 시도 로컬 폴백 시도
  //     try {
  //       const localCache = loadCache();
  //       if (localCache && Object.keys(localCache).length > 0) {
  //         setRealtimeCache(localCache);
  //         updateUIStatesFromCache(localCache);
  //       } else {
  //         initializeEmptyState();
  //       }
  //     } catch (localError) {
  //       initializeEmptyState();
  //     }
      
  //     setCurrentChapterIndex(0);
  //     setStartTime(0);
  //   });
  // }, [userId, courseData?.id, chapters?.length, dispatch]);
  // // 🔥 Redux startTime이 변경될 때 currentTime 동기화
  // useEffect(() => {
  //   if (isInitializedRe && startTimeRe >= 0) {
  //     setCurrentTime(startTimeRe);
  //     console.log(`🔄 Redux startTime 동기화: ${startTimeRe}초`);
  //   }
  // }, [startTimeRe, isInitializedRe]);

  // // 🔥 챕터 진행률 체크 (Redux 인덱스 사용)
  // useEffect(() => {
  //   console.log("🔄 [DEBUG] Redux 챕터 변경 감지:", currentChapterIndexRe);

  //   if (currentChapterIndexRe >= 0 && chapters?.length > 0) {
  //     console.log(
  //       `🔄 [DEBUG] Redux 챕터 ${currentChapterIndexRe} 진행률 체크 시작`
  //     );
  //     checkExistingChapterProgress(currentChapterIndexRe);
  //     console.log(
  //       `🔄 [DEBUG] Redux 챕터 ${currentChapterIndexRe} 진행률 체크 완료`
  //     );
  //   } else {
  //     console.log("🔄 [DEBUG] Redux 챕터 진행률 체크 조건 불만족");
  //   }
  // }, [currentChapterIndexRe, chapters?.length]); // Redu

  // 🔥 수정된 checkExistingChapterProgress 함수
  const checkExistingChapterProgress = useCallback(
    (chapterIndex: number) => {
      if (!userId || !chapters || chapters.length === 0) {
        console.warn("⚠️ 진행률 확인 생략");
        return;
      }
  
      if (chapterIndex < 0 || chapterIndex >= chapters.length) {
        console.warn(`⚠️ 유효하지 않은 챕터 인덱스 ${chapterIndex}`);
        return;
      }
  
      const chapter = chapters[chapterIndex];
      if (!chapter || !chapter.id) {
        console.warn(`⚠️ 챕터 ${chapterIndex} 데이터 없음`);
        return;
      }
  
      const progress = getProgressFromCache(chapter.id);
  
      if (progress && typeof progress.currentTime === "number" && progress.currentTime > 0) {
        // 🔥 Redux 액션 사용
        dispatch(setHasProgressData(true));
        setStartTime(progress.currentTime);
        
        console.log(`✅ 기존 진행률 발견 - 챕터 ${chapter.id}: ${progress.currentTime}초부터`);
      } else {
        // 🔥 Redux 액션 사용
        dispatch(setHasProgressData(false));
        setStartTime(0);
        
        console.log(`📝 새 챕터 - 챕터 ${chapter.id}: 처음부터 시작`);
      }
    },
    [chapters, userId, getProgressFromCache, dispatch] // dispatch 의존성 추가
  );

  // 🔥 챕터 클릭 핸들러 (Redux 적용)
  const handleChapterClickRe = (chapterId: number) => {
    const chapterIndexRe = chapters.findIndex((ch) => ch.id === chapterId);
    if (chapterIndexRe === -1) {
      console.warn("❗ 유효하지 않은 챕터 ID:", chapterId);
      return;
    }

    const selectedChapterRe = chapters[chapterIndexRe];
    console.log(`🎬 Redux: 챕터 선택: ${selectedChapterRe.title}`);

    // Redux 상태 업데이트
    // dispatch(
    //   setChapterAndTime({
    //     index: chapterIndexRe,
    //     startTime: 0, // 새 챕터는 처음부터
    //   })
    // );

    setIsVideoPlaying(false);
  };

  //---------------------기존 아래 ///// 위 리덕스 추가

  // 🔥 4. 통합된 초기화 함수
  const initializeProgress = useCallback(async (): Promise<void> => {
    console.log("🚀 [DEBUG] initializeProgress 시작");
    console.log("🚀 [DEBUG] userId:", userId);
    console.log("🚀 [DEBUG] courseData?.id:", courseData?.id);

    if (!userId || !courseData?.id) {
      console.warn("⚠️ userId 또는 courseId가 없어 초기화 생략");
      return;
    }

    console.log("🚀 진행률 초기화 시작");

    try {
      // 1️⃣ 서버에서 우선 로드
      const url = `http://localhost:8000/api/watch-progress/${userId}/${courseData.id}/`;
      console.log("Fetching progress from URL:", url);

      const res = await fetch(url);
      console.log("📡 [DEBUG] 서버 응답 상태:", res.status, res.ok);

      if (res.ok) {
        const serverData = await res.json();
        console.log("📡 [DEBUG] 서버에서 받은 데이터:", serverData);

        if (
          serverData?.chapters &&
          Object.keys(serverData.chapters).length > 0
        ) {
          console.log("📡 [DEBUG] 서버 데이터 유효함 - 변환 시작");
          console.log(
            "📡 [DEBUG] serverData.chapters 타입:",
            typeof serverData.chapters
          );
          console.log(
            "📡 [DEBUG] serverData.chapters[0] 구조:",
            serverData.chapters[0]
          );

          // 🔍 실제 데이터 구조 확인
          if (Array.isArray(serverData.chapters)) {
            console.log("📡 [DEBUG] chapters는 배열입니다");
            console.log("📡 [DEBUG] 첫 번째 원소:", serverData.chapters[0]);
          } else {
            console.log(
              "📡 [DEBUG] chapters는 배열이 아닙니다:",
              serverData.chapters
            );
          }

          // 2️⃣ 서버 데이터를 로컬 캐시 형태로 변환
          const formattedCache = convertWatchProgressToCache(
            serverData.chapters
          );
          console.log("📡 [DEBUG] 변환된 캐시:", formattedCache);

          // 3️⃣ 실시간 캐시 업데이트
          setRealtimeCache(formattedCache);
          updateCache(formattedCache); // 로컬스토리지 저장

          // 4️⃣ UI 상태 업데이트
          updateUIStatesFromCache(formattedCache);

          console.log("✅ 서버 데이터로 초기화 완료");
          return;
        }
      } else {
        throw new Error(`서버 응답 에러: ${res.statusText}`);
      }
    } catch (error) {
      console.error("❌ 서버 진행률 로드 실패:", error);
    }

    // 5️⃣ 서버 실패 시 로컬 폴백
    console.log("🔄 로컬 캐시 폴백 모드");
    try {
      const localCache = loadCache(); // 기존 함수 활용
      console.log("🔄 [DEBUG] loadCache() 결과:", localCache);
      console.log(
        "🔄 [DEBUG] 로컬 캐시 키 개수:",
        Object.keys(localCache || {}).length
      );

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
  }, [userId, courseData?.id]);

  
  //리덕스스테이트 변경
  // useEffect(() => {
  //   console.log(`🔄 [DEBUG] startTime 변경 감지: ${startTime.toFixed(1)}초`);
  //   console.log(`🔄 [DEBUG] 이전 progress_currentTime:`, progress_currentTime);
  
  //   // 🔥 Redux 액션 사용
  //   dispatch(setCurrentTime(startTime));
  
  //   console.log(`🔄 [DEBUG] VideoPlayer startTime 변경: ${startTime.toFixed(1)}초`);
  //   console.log(`🔄 [DEBUG] Redux setCurrentTime(${startTime}) 호출 완료`);
  // }, [startTime, dispatch]);


  // 🔥 Redux 상태 변화 감지 (디버깅용)
useEffect(() => {
  console.log('🔄 [Redux] progress_currentTime 변경:', progress_currentTime);
}, [progress_currentTime]);

useEffect(() => {
  console.log('🔄 [Redux] progress_hasProgressData 변경:', progress_hasProgressData);
}, [progress_hasProgressData]);

useEffect(() => {
  console.log('🔄 [Redux] progress_isVideoPlaying 변경:', progress_isVideoPlaying);
}, [progress_isVideoPlaying]);

useEffect(() => {
  console.log('🔄 [Redux] progress_lastSaveTime 변경:', progress_lastSaveTime);
}, [progress_lastSaveTime]);

useEffect(() => {
  console.log('🔄 [Redux] progress_currentVideoIndex 변경:', progress_currentVideoIndex);
}, [progress_currentVideoIndex]);


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

      // setHasProgressData(true);
      dispatch(setHasProgressData(true));

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
        courseId: courseData?.id || 1,
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
    dispatch(setIsVideoPlaying(true));
    // setIsVideoPlaying(true);
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

    // setIsVideoPlaying(false);
    dispatch(setIsVideoPlaying(false));

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
      currentTime: Math.floor(currentTime), // 정수로 변환
      totalDuration: Math.floor(duration), // 정수로 변환
      watchedPercentage: Math.min(100, (currentTime / duration) * 100), // 100% 초과 방지
      isCompleted: currentTime / duration >= 0.9, // 90% 완료 체크
      // lastUpdated: Date.now(), //
    };

    // 🔍 전송 데이터 로깅
    console.log("📤 -----에러체크----서버 전송 데이터:", {
      userId,
      courseId: courseData?.id || 1,
      chapterId: currentChapter.id,
      ...safeLocalChapter,
    });

    // 2) 서버에 저장 (ProgressTracker)
    ProgressTracker.saveProgress(
      userId,
      courseData?.id || 1,
      currentChapter.id,
      safeLocalChapter // ✅ 검증된 데이터 전달
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
    // setCurrentTime(currentTime);
    dispatch(setCurrentTime(currentTime));
    const progress = Math.min(currentTime, videoDuration);
    setChapterProgress((prev) => ({
      ...prev,
      // [currentChapterIndex]: progress, // ← UI 진행률 바 실시간 반영
    }));

    // 로컬만 저장 : 실시간 캐시 업데이트 (1초마다) -하고 내부에서 hasProgressData백업체크
    if (progress_isVideoPlaying) {
      const now: number = Date.now();
      if (now - progress_lastSaveTime > 1000) {
        const watchedPercentage: number =
          videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0;

        // 실시간 캐시 구조 변경 ✅
        const userCourseKey = `progress_${userId}_course${courseData?.id || 1}`;
        setRealtimeCache((prev: LocalProgressCache) => {
          // 기존 코스 데이터가 없으면 생성
          const existingCourse = prev[userCourseKey] || {
            userId,
            courseId: courseData?.id || 1,
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

        // setLastSaveTime(now);
        dispatch(setLastSaveTime(now));
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

    if (progress_hasProgressData) {
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
        currentTime: Math.floor(progress_currentTime), // 현재 재생 시간
        totalDuration: Math.floor(videoDuration), // 비디오 전체 길이
        watchedPercentage:
          videoDuration > 0
            ? Math.min(100, (progress_currentTime / videoDuration) * 100)
            : 0,
        isCompleted: false, // 메타데이터 로드 시점에는 완료 아님
        lastUpdated: Date.now(), // ✅ 현재 타임스탬프
      };

      // ProgressTracker.saveProgress(
      //   userId,
      //   courseData?.id || 1,
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
  const handleVideoEnded = () => {
    console.log(`🏁 비디오 재생 완료: ${currentChapter.title}`);
    setCompletedChapters((prev) => new Set([...prev, currentChapterIndex]));
    setIsVideoPlaying(false);

    if (hasProgressData) {
      ProgressTracker.completeChapter(userId, currentChapter.id);
      const summary = ProgressTracker.getUserProgressSummary(
        userId,
        chapters.length
      );
      // setProgressSummary(summary);
    }

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
    if (progress_hasProgressData && currentChapter) {
      const currentProgress = getProgressFromCache(currentChapter.id);
      if (currentProgress) {
        await ProgressTracker.saveProgress(
          userId,
          courseData?.id || 1,
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
    // setCurrentTime(0);
    dispatch(setCurrentTime(0));
  dispatch(setIsVideoPlaying(false));
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
  const saveCheckpoint = () => {
    const now = Date.now();
    if (now - lastCheckpointTime > 300000) {
      // 5분 = 300000ms
      if (hasProgressData && currentChapter && isVideoPlaying) {
        const currentProgress = getProgressFromCache(currentChapter.id);
        if (currentProgress) {
          ProgressTracker.saveProgress(
            userId,
            courseData?.id || 1,
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
  // if (isChapterLoading || !isInitialized) {
  //   return (
  //     <div className="flex h-screen bg-white items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
  //         <p className="text-gray-600">마지막 시청 정보를 불러오는 중...</p>
  //       </div>
  //     </div>
  //   );
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
                프로그래밍 기초 강의
              </span>
            </div>

            <div className="ml-4 space-y-1">
              {chapters.map((chapter, index) => {
                // const isCurrent = chapter.id === currentChapter?.id;
                // ✅ 수정 (Redux 인덱스 사용)
                const isCurrent = index === currentChapterIndexRe; // Redux에서 가져온 currentChapterIndex 사용

                // const isCompleted = completedChapters.has(index);
                // const currentProgress = chapterProgress[index]
                //   ? Math.round(
                //       (chapterProgress[index] / chapter.durationSeconds) * 100
                //     )
                //   : 0;
                // const hasProgress = currentProgress > 0;
                const realTimeProgress = chapterProgress[index]
                  ? (chapterProgress[index] / chapter.durationSeconds) * 100
                  : 0;

                const savedProgress = getProgressFromCache(chapter.id);
                const savedPercent = savedProgress
                  ? savedProgress.watchedPercentage
                  : 0;
                const currentProgress = Math.max(
                  realTimeProgress,
                  savedPercent
                );
                const hasProgress = currentProgress > 0;

                const lastWatchTime = savedProgress?.currentTime ?? 0;
                const isCompleted =
                  savedProgress?.isCompleted || completedChapters.has(index);

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
                {/* {currentChapter?.title || "영상을 선택해주세요"} */}
                {/* {currentChapterRe?.title || "영상을 선택해주세요"} */}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {/* {courseTitle} • {currentChapter?.duration || "0:00"} */}
                {courseTitle} • {courseTitle} •{" "}
                {/* {currentChapterRe?.duration || "0:00"} */}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>
                총 시간: {ProgressCalculator.formatTime(totalDuration)}
              </span>
              {/* {startTime > 0 && (
                <span className="text-green-600">
                  시작: {Math.floor(startTime)}초
                </span>
              )} */}
            </div>
          </div>
        </div>

        {/* 비디오 플레이어 영역 */}
        <div className="flex-1 bg-black relative">
          {/* {currentChapter ? (
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
          )} */}

<VideoPlayer
              // currentVideo={currentChapterRe.videoFile}
              onTimeUpdate={onVideoProgress}
              onLoadedMetadata={onVideoReady}
              onEnded={handleVideoEnded}
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              // startTime={startTimeRe}
              autoPlay
            />
          {/* {currentChapterRe ? (
            <VideoPlayer
              currentVideo={currentChapterRe.videoFile}
              onTimeUpdate={onVideoProgress}
              onLoadedMetadata={onVideoReady}
              onEnded={handleVideoEnded}
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              startTime={startTimeRe}
              autoPlay
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <p className="text-lg">왼쪽에서 학습할 챕터를 선택해주세요</p>
              </div>
            </div>
          )} */}
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
                // if (currentChapterIndex < chapters.length - 1) {
                  // setCurrentChapterIndex(currentChapterIndex + 1);
                  // ✅ 수정 (Redux 액션 사용)
                  // dispatch(
                  //   setChapterAndTime({
                  //     index: currentChapterIndex + 1,
                  //     startTime: 0, // 다음 챕터는 처음부터
                  //   })
                  // );
                // }
              }}
              // disabled={currentChapterIndex >= chapters.length - 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {/* {currentChapterIndex >= chapters.length - 1
                ? "마지막 영상"
                : "다음 영상"} */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyLayoutPlayer;
