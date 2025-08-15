export interface Chapter {
  id: number;
  title: string;
  duration: string;
  durationSeconds: number;
  videoFile: string;
  courseId?: number;
  order?: number;
}

export interface WatchProgress {
  id: string; // userId_chapterId 형태
  userId: string;
  chapterId: number;
  courseId: number;
  currentTime: number; // 현재 재생 위치 (초)
  totalDuration: number; // 비디오 전체 길이 (초)
  watchedPercentage: number; // 시청률 (%)
  isCompleted: boolean; // 완료 여부
  totalWatchTime: number; // 실제 시청한 시간 (밀리초)
  sessionCount: number; // 시청 세션 수
  watchSpeed: number; // 재생 속도
  firstWatchedAt: string; // 첫 시청 시각
  lastWatchedAt: string; // 마지막 시청 시각
  completedAt: string | null; // 완료 시각
}

export interface CreateWatchProgressParams {
  userId: string;
  chapterId: number;
  courseId?: number;
}

export interface UpdateWatchProgressParams {
  currentTime?: number;
  watchedPercentage?: number;
  totalWatchTime?: number;
  sessionCount?: number;
  watchSpeed?: number;
  isCompleted?: boolean;
}

export interface UserProgressSummary {
  userId: string;
  courseId: number;
  totalChapters: number;
  completedChapters: number;
  overallProgress: number;
  totalWatchTime: number;
  lastActiveAt: string;
  currentChapter: number;
}