import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, Settings, RotateCcw } from "lucide-react";
import { WatchProgress, Chapter } from "../../types/videoTypes";
import { WatchProgressService } from "../../services/WatchProgressService";
import { chaptersData } from "../../data/chapters";
import { useWatchProgress } from "../../hooks/useWatchProgress";

interface VideoPlayerProps {
  userId: string;
  chapterId: number;
  onProgressUpdate?: (progress: WatchProgress) => void;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  userId,
  chapterId,
  onProgressUpdate,
  className = "",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [watchStartTime, setWatchStartTime] = useState<number | null>(null);
  const [sessionWatchTime, setSessionWatchTime] = useState<number>(0);

  const { watchProgress, loading, error, updateProgress, incrementSession } =
    useWatchProgress(userId, chapterId);

  // 비디오 메타데이터 로드 완료
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current && watchProgress) {
      videoRef.current.currentTime = watchProgress.currentTime;
    }
  }, [watchProgress]);

  // 재생/일시정지 토글
  const togglePlay = useCallback(async () => {
    if (!videoRef.current || !watchProgress) return;

    try {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);

        // 일시정지 시 세션 시청 시간 계산
        if (watchStartTime) {
          const sessionTime = Date.now() - watchStartTime;
          setSessionWatchTime((prev) => prev + sessionTime);
          setWatchStartTime(null);
        }
      } else {
        await videoRef.current.play();
        setIsPlaying(true);
        setWatchStartTime(Date.now());
      }
    } catch (error) {
      console.error("비디오 재생 오류:", error);
    }
  }, [isPlaying, watchProgress, watchStartTime]);

  // 시간 업데이트 처리
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current || !watchProgress) return;

    const currentTime = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    const watchedPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    // 5초마다 진행률 저장
    if (Math.floor(currentTime) % 5 === 0) {
      let totalWatchTime = watchProgress.totalWatchTime + sessionWatchTime;
      if (watchStartTime) {
        totalWatchTime += Date.now() - watchStartTime;
      }

      const updates = {
        currentTime,
        watchedPercentage,
        totalWatchTime,
      };

      updateProgress(updates);

      // 콜백 호출
      if (onProgressUpdate) {
        onProgressUpdate({ ...watchProgress, ...updates });
      }
    }
  }, [
    watchProgress,
    sessionWatchTime,
    watchStartTime,
    updateProgress,
    onProgressUpdate,
  ]);

  // 처음부터 다시보기
  const restartVideo = useCallback(() => {
    if (videoRef.current && watchProgress) {
      videoRef.current.currentTime = 0;
      updateProgress({
        currentTime: 0,
        watchedPercentage: 0,
      });
      incrementSession();
    }
  }, [watchProgress, updateProgress, incrementSession]);

  // 비디오 종료 처리
  const handleVideoEnded = useCallback(() => {
    setIsPlaying(false);
    if (watchStartTime) {
      const sessionTime = Date.now() - watchStartTime;
      setSessionWatchTime((prev) => prev + sessionTime);
      setWatchStartTime(null);
    }
  }, [watchStartTime]);

  // 로딩 상태
  if (loading) {
    return (
      <div
        className={`flex items-center justify-center h-64 bg-gray-100 rounded-lg ${className}`}
      >
        <div className="text-gray-500">진행률 데이터 로딩 중...</div>
      </div>
    );
  }

  // 에러 상태
  if (error || !watchProgress) {
    return (
      <div
        className={`flex items-center justify-center h-64 bg-red-50 rounded-lg border border-red-200 ${className}`}
      >
        <div className="text-red-600">
          {error || "진행률 데이터를 불러올 수 없습니다."}
        </div>
      </div>
    );
  }

  const chapter = chaptersData.find((c) => c.id === chapterId);

  return (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}
    >
      {/* 헤더 */}
      <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h3 className="text-xl font-bold">📺 {chapter?.title}</h3>
        <p className="text-blue-100 text-sm">사용자: {userId}</p>
      </div>

      {/* 진행률 표시 */}
      <div className="p-4 bg-blue-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-700">시청 진행률</span>
          {watchProgress.isCompleted && (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">완료</span>
            </div>
          )}
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${watchProgress.watchedPercentage}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-600">
          <span>{watchProgress.watchedPercentage.toFixed(1)}% 완료</span>
          <span>세션 {watchProgress.sessionCount}회</span>
          <span>
            총 {Math.floor(watchProgress.totalWatchTime / (1000 * 60))}분 시청
          </span>
        </div>
      </div>

      {/* 비디오 플레이어 */}
      <div className="relative bg-black">
        <video
          ref={videoRef}
          className="w-full h-auto"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          src="https://www.w3schools.com/html/mov_bbb.mp4"
        />

        {/* 이어보기 알림 */}
        {watchProgress.currentTime > 10 &&
          watchProgress.watchedPercentage < 90 && (
            <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg text-sm backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>이어보기: {formatTime(watchProgress.currentTime)}</span>
              </div>
            </div>
          )}
      </div>

      {/* 컨트롤 버튼 */}
      <div className="p-4 bg-gray-50">
        <div className="flex justify-center gap-3">
          <button
            onClick={togglePlay}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isPlaying ? "일시정지" : "재생"}
          </button>

          <button
            onClick={restartVideo}
            className="flex items-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            처음부터
          </button>
        </div>
      </div>
    </div>
  );
};
