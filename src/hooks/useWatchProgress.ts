import { useState, useEffect, useCallback } from "react";
import { WatchProgress, UpdateWatchProgressParams } from "../types/videoTypes";
import { WatchProgressService } from "../services/WatchProgressService";

export const useWatchProgress = (userId: string, chapterId: number) => {
  const [watchProgress, setWatchProgress] = useState<WatchProgress | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 진행률 로드 또는 생성
  const loadOrCreateProgress = useCallback(() => {
    try {
      setLoading(true);
      setError(null);

      let progress = WatchProgressService.getWatchProgress(userId, chapterId);

      // 🎯 진행률 데이터가 없으면 새로 생성
      if (!progress) {
        progress = WatchProgressService.createWatchProgress({
          userId,
          chapterId,
        });
      }

      setWatchProgress(progress);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "알 수 없는 오류";
      setError(errorMessage);
      console.error("진행률 로드 오류:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, chapterId]);

  // 진행률 업데이트
  const updateProgress = useCallback(
    (updates: UpdateWatchProgressParams) => {
      try {
        const updated = WatchProgressService.updateWatchProgress(
          userId,
          chapterId,
          updates
        );
        if (updated) {
          setWatchProgress(updated);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "진행률 업데이트 실패";
        setError(errorMessage);
        console.error("진행률 업데이트 오류:", err);
      }
    },
    [userId, chapterId]
  );

  // 세션 카운트 증가
  const incrementSession = useCallback(() => {
    if (watchProgress) {
      updateProgress({ sessionCount: watchProgress.sessionCount + 1 });
    }
  }, [watchProgress, updateProgress]);

  // 진행률 초기화
  const resetProgress = useCallback(() => {
    if (watchProgress) {
      updateProgress({
        currentTime: 0,
        watchedPercentage: 0,
        isCompleted: false,
      });
    }
  }, [watchProgress, updateProgress]);

  useEffect(() => {
    loadOrCreateProgress();
  }, [loadOrCreateProgress]);

  return {
    watchProgress,
    loading,
    error,
    updateProgress,
    incrementSession,
    resetProgress,
    reload: loadOrCreateProgress,
  };
};
