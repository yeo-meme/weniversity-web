import React, { useState, useEffect } from "react";
import { User, CheckCircle } from "lucide-react";
import {
  // WatchProgress,
  // UserProgressSummary,
  // Chapter,
} from "../../types/videoTypes";
import { WatchProgressService } from "../../services/WatchProgressService";
// import { chaptersData } from "../../data/chapters";
import { formatWatchTime } from "../../utils/formatters";

interface ProgressDashboardProps {
  userId: string;
  onChapterSelect?: (chapterId: number) => void;
  className?: string;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  userId,
  onChapterSelect,
  className = "",
}) => {
  const [userProgress, setUserProgress] = useState<
    (WatchProgress & { chapterInfo: Chapter })[]
  >([]);
  const [summary, setSummary] = useState<UserProgressSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true);
        const progress = WatchProgressService.getUserProgress(userId);
        const progressSummary =
          WatchProgressService.getUserProgressSummary(userId);

        setUserProgress(progress);
        setSummary(progressSummary);
      } catch (error) {
        console.error("대시보드 데이터 로드 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center h-64 bg-gray-100 rounded-lg ${className}`}
      >
        <div className="text-gray-500">대시보드 로딩 중...</div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}
    >
      {/* 헤더 */}
      <div className="p-4 bg-gradient-to-r from-green-500 to-teal-600 text-white">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <User className="w-5 h-5" />
          {userId}의 학습 현황
        </h3>
      </div>

      {/* 전체 진행률 요약 */}
      {summary && (
        <div className="p-4 bg-green-50">
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium text-green-700">전체 진행률</span>
            <span className="text-sm text-green-600">
              {summary.completedChapters}/{summary.totalChapters} 완료
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
            <div
              className="bg-gradient-to-r from-green-500 to-teal-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${summary.overallProgress}%` }}
            />
          </div>

          <div className="flex justify-between text-sm text-green-600">
            <span>{summary.overallProgress.toFixed(1)}%</span>
            <span>총 학습시간: {formatWatchTime(summary.totalWatchTime)}</span>
          </div>
        </div>
      )}

      {/* 챕터별 진행률 */}
      <div className="p-4">
        <h4 className="font-medium text-gray-700 mb-3">챕터별 진행률</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {chaptersData.map((chapter) => {
            const progress = userProgress.find(
              (p) => p.chapterId === chapter.id
            );
            const hasProgress = progress !== undefined;

            return (
              <div
                key={chapter.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  hasProgress
                    ? "border-blue-200 bg-blue-50 hover:bg-blue-100"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => onChapterSelect?.(chapter.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{chapter.title}</span>
                  <div className="flex items-center gap-1">
                    {progress?.isCompleted && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    <span className="text-xs text-gray-500">
                      {chapter.duration}
                    </span>
                  </div>
                </div>

                {hasProgress ? (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.watchedPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{progress.watchedPercentage.toFixed(1)}%</span>
                      <span>세션 {progress.sessionCount}회</span>
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-gray-400 py-2">
                    아직 시청하지 않음
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
