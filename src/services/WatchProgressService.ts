
interface Chapter {
  id: number;
  title: string;
  duration: string;
  durationSeconds: number;
  videoFile: string;
  courseId?: number;
  order?: number;
}

interface WatchProgress {
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

interface CreateWatchProgressParams {
  userId: string;
  chapterId: number;
  courseId?: number;
}

interface UpdateWatchProgressParams {
  currentTime?: number;
  watchedPercentage?: number;
  totalWatchTime?: number;
  sessionCount?: number;
  watchSpeed?: number;
  isCompleted?: boolean;
}

interface UserProgressSummary {
  userId: string;
  courseId: number;
  totalChapters: number;
  completedChapters: number;
  overallProgress: number;
  totalWatchTime: number;
  lastActiveAt: string;
  currentChapter: number;
}

// 2. 챕터 데이터도 내부에 정의 (import 문제 해결)
const chaptersData: Chapter[] = [
  {
    id: 1,
    title: "변수와 상수",
    duration: "5:00",
    durationSeconds: 300,
    videoFile: "video1.mp4",
    courseId: 1,
    order: 1
  },
  {
    id: 2,
    title: "연산자 종류",
    duration: "10:00",
    durationSeconds: 600,
    videoFile: "video2.mp4",
    courseId: 1,
    order: 2
  },
  {
    id: 3,
    title: "조건문 기초",
    duration: "8:00",
    durationSeconds: 480,
    videoFile: "video3.mp4",
    courseId: 1,
    order: 3
  },
  {
    id: 4,
    title: "반복문 활용",
    duration: "12:00",
    durationSeconds: 720,
    videoFile: "video4.mp4",
    courseId: 1,
    order: 4
  },
  {
    id: 5,
    title: "함수 정의",
    duration: "15:00",
    durationSeconds: 900,
    videoFile: "video5.mp4",
    courseId: 1,
    order: 5
  },
  {
    id: 6,
    title: "실습 문제",
    duration: "10:00",
    durationSeconds: 600,
    videoFile: "video6.mp4",
    courseId: 1,
    order: 6
  }
];

// 3. WatchProgressService 클래스
export class WatchProgressService {
  private static readonly STORAGE_PREFIX = 'watch_progress_';
  private static readonly COMPLETION_THRESHOLD = 90; // 90% 이상 시청시 완료

  // 진행률 데이터 생성 (사용자가 비디오를 처음 시청할 때)
  static createWatchProgress({ 
    userId, 
    chapterId, 
    courseId = 1 
  }: CreateWatchProgressParams): WatchProgress | null {
    
    if (!userId || !chapterId) {
      console.error("❌ 유효하지 않은 userId 또는 chapterId", { userId, chapterId });
      return null;
    }
    
    const chapter = chaptersData.find(c => c.id === chapterId);
    if (!chapter) {
      console.error(`Chapter ${chapterId} not found`);
      return null;
    }

    const now = new Date().toISOString();
    const watchProgress: WatchProgress = {
      id: `${userId}_${chapterId}`,
      userId,
      chapterId,
      courseId,
      currentTime: 0,
      totalDuration: chapter.durationSeconds,
      watchedPercentage: 0,
      isCompleted: false,
      totalWatchTime: 0,
      sessionCount: 1, // 첫 시청이므로 1
      watchSpeed: 1.0,
      firstWatchedAt: now,
      lastWatchedAt: now,
      completedAt: null
    };

    // 로컬스토리지에 저장
    const storageKey = `${this.STORAGE_PREFIX}${userId}_chapter${chapterId}`;
    localStorage.setItem(storageKey, JSON.stringify(watchProgress));
    
    console.log(`✅ 새로운 시청 기록 생성:`, { chapter: chapter.title, userId });
    return watchProgress;
  }

  // 기존 진행률 불러오기
  static getWatchProgress(userId: string, chapterId: number): WatchProgress | null {
    const storageKey = `${this.STORAGE_PREFIX}${userId}_chapter${chapterId}`;
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : null;
  }

  // 진행률 업데이트
  static updateWatchProgress(
    userId: string, 
    chapterId: number, 
    updates: UpdateWatchProgressParams
  ): WatchProgress | null {
    const existing = this.getWatchProgress(userId, chapterId);
    if (!existing) {
      console.error(`진행률 데이터가 없습니다: user ${userId}, chapter ${chapterId}`);
      return null;
    }

    const updated: WatchProgress = {
      ...existing,
      ...updates,
      lastWatchedAt: new Date().toISOString()
    };

    // 완료 체크 (90% 이상)
    if (updated.watchedPercentage >= this.COMPLETION_THRESHOLD && !updated.isCompleted) {
      updated.isCompleted = true;
      updated.completedAt = new Date().toISOString();
      console.log(`🎉 챕터 완료:`, { chapterId, userId });
    }

    const storageKey = `${this.STORAGE_PREFIX}${userId}_chapter${chapterId}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return updated;
  }

  // 사용자의 모든 진행률 조회
  static getUserProgress(userId: string): (WatchProgress & { chapterInfo: Chapter })[] {
    const progressList: (WatchProgress & { chapterInfo: Chapter })[] = [];
    
    chaptersData.forEach(chapter => {
      const progress = this.getWatchProgress(userId, chapter.id);
      if (progress) {
        progressList.push({ ...progress, chapterInfo: chapter });
      }
    });
    
    return progressList.sort((a, b) => a.chapterInfo.order! - b.chapterInfo.order!);
  }

  // 사용자 진행률 요약
  static getUserProgressSummary(userId: string): UserProgressSummary {
    const userProgress = this.getUserProgress(userId);
    const completedChapters = userProgress.filter(p => p.isCompleted).length;
    const overallProgress = userProgress.length > 0 ? 
      userProgress.reduce((sum, p) => sum + p.watchedPercentage, 0) / userProgress.length : 0;
    const totalWatchTime = userProgress.reduce((sum, p) => sum + p.totalWatchTime, 0);
    const currentChapter = userProgress.find(p => !p.isCompleted)?.chapterId || chaptersData.length;

    return {
      userId,
      courseId: 1,
      totalChapters: chaptersData.length,
      completedChapters,
      overallProgress,
      totalWatchTime,
      lastActiveAt: new Date().toISOString(),
      currentChapter
    };
  }

  // 진행률 데이터 존재 여부 확인
  static hasWatchProgress(userId: string, chapterId: number): boolean {
    return this.getWatchProgress(userId, chapterId) !== null;
  }

  // 모든 사용자 데이터 삭제 (개발/테스트용)
  static clearAllUserData(userId: string): void {
    chaptersData.forEach(chapter => {
      const storageKey = `${this.STORAGE_PREFIX}${userId}_chapter${chapter.id}`;
      localStorage.removeItem(storageKey);
    });
    console.log(`🗑️ ${userId}의 모든 시청 기록 삭제`);
  }
}