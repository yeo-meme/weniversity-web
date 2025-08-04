// src/components/StudyPlayer.tsx
import React, { useState, useRef, useEffect,useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize, Settings, BookOpen, Clock, CheckCircle, X, RotateCcw } from 'lucide-react';

// ProgressTracker import
import { ProgressTracker } from '../../services/ProgressTracker';

// 챕터 데이터 타입
interface Chapter {
  id: number;
  title: string;
  time: string;
  duration: string;
  durationSeconds: number;
  videoFile: string;
  completed: boolean;
}

// 챕터 데이터
const chapters: Chapter[] = [
  { 
    id: 1,
    title: "변수와 상수", 
    time: "0:00", 
    duration: "5:00", 
    durationSeconds: 5,
    videoFile: "video1.mp4",
    completed: false 
  },
  { 
    id: 2,
    title: "연산자 종류", 
    time: "5:00", 
    duration: "10:00", 
    durationSeconds: 5,
    videoFile: "video2.mp4",
    completed: false 
  },
  { 
    id: 3,
    title: "조건문 기초", 
    time: "15:00", 
    duration: "8:00", 
    durationSeconds: 5,
    videoFile: "video3.mp4",
    completed: false 
  },
  { 
    id: 4,
    title: "반복문 활용", 
    time: "23:00", 
    duration: "12:00", 
    durationSeconds: 5,
    videoFile: "video4.mp4",
    completed: false 
  },
  { 
    id: 5,
    title: "함수 정의", 
    time: "35:00", 
    duration: "15:00", 
    durationSeconds: 5,
    videoFile: "video5.mp4",
    completed: false 
  },
  { 
    id: 6,
    title: "실습 문제", 
    time: "50:00", 
    duration: "10:00", 
    durationSeconds: 5,
    videoFile: "video6.mp4",
    completed: false 
  },
];

// 비디오 플레이어 컴포넌트
interface VideoPlayerProps {
  currentVideo: string;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onLoadedMetadata: (duration: number) => void;
  onEnded: () => void;
  onPlay: () => void; // ▶️ 재생 시작 이벤트 추가
  startTime?: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  currentVideo, 
  onTimeUpdate, 
  onLoadedMetadata, 
  onEnded,
  onPlay, // ▶️ 새로 추가
  startTime = 0
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (videoRef.current) {
      console.log(`🎬 비디오 로드 시도: ${currentVideo}`);
      videoRef.current.load();
    }
  }, [currentVideo]);

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

  // 시작 지점 설정
  useEffect(() => {
    if (videoRef.current && startTime > 0) {
      videoRef.current.currentTime = startTime;
      console.log(`▶️ 이어보기: ${startTime}초부터 시작`);
    }
  }, [startTime, currentVideo]);
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current;
      onTimeUpdate(currentTime, duration);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const { duration } = videoRef.current;
      onLoadedMetadata(duration);
      
      // 메타데이터 로드 후 시작 지점 설정
      if (startTime > 0) {
        videoRef.current.currentTime = startTime;
      }
    }
  };

  const handleEnded = () => {
    onEnded();
  };

  // ▶️ 재생 시작 이벤트 핸들러 추가
  const handlePlay = () => {
    console.log('🎬 비디오 재생 시작!');
    onPlay();
  };
  
  return (
    <div className="w-full">
      <video
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={handlePlay} // ▶️ 재생 이벤트 추가
        onLoadStart={handleLoadStart}      // 🔥 추가
        onCanPlay={handleCanPlay}          // 🔥 추가
        onError={handleError}              // 🔥 추가
        onLoadedData={handleLoadedData}    // 🔥 추가
        controls
        className="w-full aspect-video rounded-lg"
      >
        <source src={`/video/${currentVideo}`} type="video/mp4" />
        브라우저가 video 태그를 지원하지 않습니다.
      </video>
    </div>
  );
};

// 메인 컴포넌트 Props
interface StudyPlayerProps {
  onClose: () => void;
  courseData: {
    id: number;
    title: string;
    description?: string;
  } | null;
  userId?: string;
}

const StudyPlayer: React.FC<StudyPlayerProps> = ({ 
  onClose, 
  courseData, 
  userId = 'user123'
}) => {

// 🔥 챕터별 진행률을 상태로 캐시하여 불필요한 조회 방지
const [cachedProgress, setCachedProgress] = useState<Record<number, any>>({});


  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [completedChapters, setCompletedChapters] = useState(new Set<number>());
  const [chapterProgress, setChapterProgress] = useState<Record<number, number>>({});
  const [progressSummary, setProgressSummary] = useState<any>(null);
  const [startTime, setStartTime] = useState(0);
  
  // 🔥 진행률 추적 상태 관리
  const [hasProgressData, setHasProgressData] = useState(false); // 진행률 데이터 존재 여부
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);   // 비디오 재생 상태
  const [lastSaveTime, setLastSaveTime] = useState(0);          // 마지막 저장 시간

  const currentChapter = chapters[currentChapterIndex];
  const totalDuration = chapters.reduce((acc, chapter) => acc + chapter.durationSeconds, 0);

  // 🔥 컴포넌트 마운트 시 기존 진행률만 조회 (생성하지 않음)
  useEffect(() => {
    loadExistingProgress();
  }, [userId]);

  // 🔥 챕터 변경 시 기존 진행률 확인 (생성하지 않음) 무한루프발생
  // useEffect(() => {
  //   checkExistingChapterProgress(currentChapterIndex);
  // }, [currentChapterIndex, userId]);
  useEffect(() => {
    if (currentChapterIndex >= 0) { // 유효한 인덱스일 때만
      checkExistingChapterProgress(currentChapterIndex);
    }
  }, [currentChapterIndex]); // userId 제거

  // 📊 기존 진행률 데이터만 조회 (생성 X)
  const loadExistingProgress = useCallback(() => {
    console.log(`🔍 사용자 ${userId} 진행률 최초 로드...`);
    
    const progressCache: Record<number, any> = {};
    const userCompletedChapters = new Set<number>();
    const userChapterProgress: Record<number, number> = {};
    
    chapters.forEach((chapter, index) => {
      const progress = ProgressTracker.getWatchProgress(userId, chapter.id);
      if (progress) {
        progressCache[chapter.id] = progress; // 캐시에 저장
        if (progress.isCompleted) {
          userCompletedChapters.add(index);
        }
        userChapterProgress[index] = progress.currentTime;
      }
    });
    
    setCachedProgress(progressCache); // 캐시 상태 업데이트
    setCompletedChapters(userCompletedChapters);
    setChapterProgress(userChapterProgress);
    
    console.log(`📈 진행률 캐시 완료:`, progressCache);
  }, [userId]);

  const getProgressFromCache = (chapterId: number) => {
    return cachedProgress[chapterId] || ProgressTracker.getWatchProgress(userId, chapterId);
  };

  // 📊 특정 챕터의 기존 진행률 확인 (생성 X)
// 📊 특정 챕터의 기존 진행률 확인 및 상태 설정
const checkExistingChapterProgress = (chapterIndex: number) => {
  const chapter = chapters[chapterIndex];
  if (!chapter || !userId) {
    console.warn("⚠️ chapter 또는 userId 없음 — 진행률 확인 생략");
    return;
  }

  const progress = ProgressTracker.getWatchProgress(userId, chapter.id);

  if (progress && typeof progress.currentTime === "number") {
    setStartTime(progress.currentTime);
    setHasProgressData(true);

    console.log(
      `📖 기존 진행률 발견 - 챕터 ${chapter.id}: ${progress.currentTime}초부터 (전체 ${progress.watchedPercentage}%)`
    );
  } else {
    setStartTime(0);
    setHasProgressData(false);

    console.log(`📝 새 챕터 - 챕터 ${chapter.id}: 처음부터 시작`);
  }
};


  // 🎬 비디오 재생 시작 시 진행률 생성
  const handleVideoPlay = () => {
    console.log(`🎬 비디오 재생 시작 - 챕터 ${currentChapter.id}`);
    
    if (!hasProgressData) {
      // 진행률 데이터가 없을 때만 생성
      console.log(`📝 새 진행률 생성: 사용자 ${userId}, 챕터 ${currentChapter.id}`);
      
      const newProgress = ProgressTracker.createWatchProgress({
        userId,
        chapterId: currentChapter.id,
        courseId: courseData?.id || 1
      });
      
      if (newProgress) {
        setHasProgressData(true);
        console.log(`✅ 진행률 생성 완료: ${newProgress.id}`);
      }
    }
    
    setIsVideoPlaying(true);
  };

  // 🎥 비디오 시간 업데이트 핸들러 (진행률 데이터가 있을 때만 저장)
  const handleTimeUpdate = (currentTime: number, videoDuration: number) => {
    setCurrentTime(currentTime);
    
    // 현재 챕터의 진행률 업데이트 (UI용)
    const progress = Math.min(currentTime, videoDuration);
    setChapterProgress(prev => ({
      ...prev,
      [currentChapterIndex]: progress
    }));

    // 🔥 진행률 데이터가 있고 비디오가 재생 중일 때만 저장
    if (hasProgressData && isVideoPlaying) {
      // 5초마다 저장 (너무 자주 저장하지 않기 위해)
      const now = Date.now();
      if (now - lastSaveTime > 5000) { // 5초 간격
        const watchedPercentage = videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0;
        
        console.log(`💾 진행률 저장: ${watchedPercentage.toFixed(1)}% (${currentTime.toFixed(1)}초)`);
        
        ProgressTracker.updateWatchProgress(userId, currentChapter.id, {
          currentTime,
          totalDuration: videoDuration,
          watchedPercentage,
          watchSpeed: 1.0
        });
        
        setLastSaveTime(now);
      }
    }

    // 90% 이상 재생되면 완료로 표시
    if (videoDuration > 0 && currentTime / videoDuration >= 0.9) {
      if (!completedChapters.has(currentChapterIndex)) {
        setCompletedChapters(prev => new Set([...prev, currentChapterIndex]));
        
        if (hasProgressData) {
          ProgressTracker.completeChapter(userId, currentChapter.id);
          console.log(`🎉 챕터 완료: ${currentChapter.title}`);
        }
      }
    }
  };

  // 🎥 비디오 메타데이터 로드 핸들러
  const handleLoadedMetadata = (videoDuration: number) => {
    setDuration(videoDuration);
    console.log(`📊 비디오 메타데이터 로드: ${videoDuration}초`);
    
    // 진행률 데이터가 있을 때만 업데이트
    if (hasProgressData) {
      ProgressTracker.updateWatchProgress(userId, currentChapter.id, {
        totalDuration: videoDuration
      });
    }
  };

  // 🎥 비디오 끝남 핸들러
  const handleVideoEnded = () => {
    console.log(`🏁 비디오 재생 완료: ${currentChapter.title}`);
    
    // 현재 챕터를 완료로 표시
    setCompletedChapters(prev => new Set([...prev, currentChapterIndex]));
    
    if (hasProgressData) {
      ProgressTracker.completeChapter(userId, currentChapter.id);
      
      // 진행률 요약 업데이트
      const summary = ProgressTracker.getUserProgressSummary(userId, chapters.length);
      setProgressSummary(summary);
    }
    
    setIsVideoPlaying(false);
    
    // 다음 챕터로 자동 이동
    if (currentChapterIndex < chapters.length - 1) {
      console.log(`➡️ 다음 챕터로 자동 이동: ${chapters[currentChapterIndex + 1].title}`);
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

  // 🔄 이어보기 기능
  const handleContinueWatching = () => {
    const nextChapter = ProgressTracker.getNextChapterToWatch(userId, chapters.length);
    const chapterIndex = chapters.findIndex(ch => ch.id === nextChapter);
    
    if (chapterIndex !== -1) {
      const lastPosition = ProgressTracker.getLastWatchPosition(userId, nextChapter);
      
      setCurrentChapterIndex(chapterIndex);
      setStartTime(lastPosition);
      
      console.log(`▶️ 이어보기: 챕터 ${nextChapter} (${chapters[chapterIndex].title}) ${lastPosition}초부터`);
    }
  };

  // 🗑️ 진행률 초기화
  const handleResetProgress = () => {
    if (confirm('모든 학습 진행률을 초기화하시겠습니까?')) {
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

  // 시간 포맷팅
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return hrs > 0 
      ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 전체 완료된 시간 계산
  const completedTime = Array.from(completedChapters).reduce((acc, chapterIndex) => {
    return acc + chapters[chapterIndex].durationSeconds;
  }, 0) + (chapterProgress[currentChapterIndex] || 0);

  const overallProgress = totalDuration > 0 ? (completedTime / totalDuration) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
              <span>강의 목록으로</span>
            </button>
            
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">
                {courseData?.title || '프로그래밍 기초 강의'}
              </h1>
              <p className="text-sm text-gray-500">사용자: {userId}</p>
            </div>

            {/* 이어보기 & 초기화 버튼 */}
            <div className="flex gap-2">
              <button
                onClick={handleContinueWatching}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                <Play className="w-4 h-4" />
                이어보기
              </button>
              
              <button
                onClick={handleResetProgress}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                초기화
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Video Container */}
          <div className="relative bg-black group">
            <VideoPlayer 
              currentVideo={currentChapter.videoFile}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleVideoEnded}
              onPlay={handleVideoPlay} // 🔥 재생 시작 이벤트 연결
              startTime={startTime}
            />
            
            {/* Current chapter info */}
            <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg opacity-90">
              <div className="flex items-center gap-2 text-sm">
                <Play className="w-4 h-4" />
                <span>{currentChapter.title}</span>
                {/* 진행률 데이터 상태 표시 */}
                <span className={`w-2 h-2 rounded-full ${hasProgressData ? 'bg-green-400' : 'bg-yellow-400'}`} 
                      title={hasProgressData ? '진행률 추적 중' : '진행률 미생성'}></span>
              </div>
            </div>
          </div>

          {/* Video Information */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentChapter.title}
                </h1>
                <p className="text-gray-600">
                  {courseData?.description || '프로그래밍의 기본 연산과 구문에 대해 학습합니다.'}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(totalDuration)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{Math.round(overallProgress)}% 완료</span>
                </div>
              </div>
            </div>

            {/* Progress Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">학습 진행률</h3>
                <span className="text-sm text-gray-600">
                  {progressSummary ? `${Math.round(progressSummary.overallProgress)}%` : `${Math.round(overallProgress)}%`} 완료
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressSummary ? progressSummary.overallProgress : overallProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>시청 시간: {formatTime(completedTime)}</span>
                <span>남은 시간: {formatTime(totalDuration - completedTime)}</span>
              </div>
              
              {/* 현재 챕터 진행률 */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>현재 챕터: {currentChapter.title}</span>
                  <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* 진행률 추적 상태 표시 */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className={`w-2 h-2 rounded-full ${hasProgressData ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                  <span>
                    {hasProgressData ? '진행률 추적 중' : '재생 버튼을 눌러 추적 시작'}
                  </span>
                  {isVideoPlaying && (
                    <span className="text-blue-600">• 재생 중 (5초마다 자동 저장)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Chapter Navigation */}
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                목차
              </h3>
              <div className="space-y-2">
                {chapters.map((chapter, index) => {
                  const isCompleted = completedChapters.has(index);
                  const isCurrent = index === currentChapterIndex;
                  const chapterProgressPercent = chapterProgress[index] 
                    ? (chapterProgress[index] / chapter.durationSeconds) * 100 
                    : 0;

                  // 저장된 진행률 정보
                  const savedProgress = ProgressTracker.getWatchProgress(userId, chapter.id);
                  const savedPercent = savedProgress ? savedProgress.watchedPercentage : 0;
                  const lastWatchTime = savedProgress ? savedProgress.currentTime : 0;
                  const hasData = savedProgress !== null;

                  return (
                    <div
                      key={chapter.id}
                      onClick={() => handleChapterClick(index)}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        isCurrent 
                          ? 'bg-blue-50 border border-blue-200' 
                          : isCompleted 
                            ? 'bg-green-50 hover:bg-green-100' 
                            : hasData
                              ? 'bg-yellow-50 hover:bg-yellow-100'
                              : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : isCurrent
                              ? 'bg-blue-500 text-white'
                              : hasData
                                ? 'bg-yellow-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <span className="text-xs font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{chapter.title}</h4>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-500">
                              {chapter.time} • {chapter.duration}
                            </p>
                            
                            {/* 진행률 정보 표시 */}
                            {hasData && savedPercent > 0 && savedPercent < 100 && (
                              <div className="flex items-center gap-1 text-xs">
                                <span className="text-blue-600">{Math.round(savedPercent)}%</span>
                                <span className="text-gray-500">({formatTime(lastWatchTime)})</span>
                              </div>
                            )}
                            
                            {/* 진행률 바 */}
                            {(chapterProgressPercent > 0 || savedPercent > 0) && !isCompleted && (
                              <div className="flex-1 max-w-20">
                                <div className="w-full bg-gray-200 rounded-full h-1">
                                  <div 
                                    className={`h-1 rounded-full ${
                                      isCurrent ? 'bg-blue-400' : 'bg-yellow-400'
                                    }`}
                                    style={{ 
                                      width: `${Math.max(chapterProgressPercent, savedPercent)}%` 
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* 상태 표시 */}
                      <div className="flex items-center gap-2 text-sm font-medium">
                        {isCurrent && (
                          <div className="flex items-center gap-2 text-blue-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            재생 중
                          </div>
                        )}
                        {isCompleted && (
                          <span className="text-green-600">완료</span>
                        )}
                        {!isCompleted && hasData && !isCurrent && (
                          <span className="text-yellow-600">
                            {formatTime(lastWatchTime)}부터
                          </span>
                        )}
                        {!hasData && !isCurrent && (
                          <span className="text-gray-400 text-xs">미시청</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 디버그 정보 (개발 중에만 표시) */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
              <h4 className="font-medium mb-2">🔧 디버그 정보</h4>
              <div className="space-y-1">
                <div>현재 챕터: {currentChapter.id} - {currentChapter.title}</div>
                <div>현재 재생 시간: {formatTime(currentTime)} / {formatTime(duration)}</div>
                <div>시작 지점: {formatTime(startTime)}</div>
                <div>진행률 데이터 존재: {hasProgressData ? '✅ 있음' : '❌ 없음'}</div>
                <div>비디오 재생 상태: {isVideoPlaying ? '▶️ 재생 중' : '⏸️ 정지'}</div>
                <div>완료된 챕터: [{Array.from(completedChapters).join(', ')}]</div>
                <div>전체 진행률: {Math.round(overallProgress)}%</div>
                {progressSummary && (
                  <div>저장된 진행률: {Math.round(progressSummary.overallProgress)}% ({progressSummary.completedChapters}/{progressSummary.totalChapters})</div>
                )}
              </div>
              <div className="mt-2 p-2 bg-blue-50 rounded text-blue-700">
                <div className="font-medium mb-1">📋 수정된 로직:</div>
                <div className="text-xs space-y-1">
                  <div>1. 페이지 로드: 기존 진행률만 조회 (생성 X)</div>
                  <div>2. 재생 버튼 클릭: 진행률 데이터 생성</div>
                  <div>3. 재생 중: 5초마다 자동 저장</div>
                  <div>4. 90% 이상: 자동 완료 처리</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlayer;