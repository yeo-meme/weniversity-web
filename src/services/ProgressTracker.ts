import type {
  WatchProgress,
  CreateWatchProgressParams,
  UpdateWatchProgressParams,
  UserProgressSummary,
  LocalChapterCache,
  LocalProgressCache,
} from '../types/progress.types'; 

import  { convertCacheToWatchProgress } from '../utils/convertCacheToWatchProgress';  





export class ProgressTracker {
  private static readonly STORAGE_KEY = "video_watch_progress";
  private static readonly LOCAL_CACHE_KEY = "local_progress_cache";

  // 모든 진행률 데이터 가져오기
  private static getAllProgress(): Record<string, WatchProgress> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  // 진행률 데이터 저장
  private static saveAllProgress(data: Record<string, WatchProgress>): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  //  // 로컬 캐시(간단한 LocalCourseCache 형태) 불러오기
  //  static getLocalCache(): LocalProgressCache {
  //   const stored = localStorage.getItem(this.LOCAL_CACHE_KEY);
  //   return stored ? JSON.parse(stored) : {};
  // }

  // 🔥 1. 새 진행률 생성
  static createWatchProgress(params: CreateWatchProgressParams): WatchProgress {
    console.log(
      `🔧 진행률 생성: 사용자 ${params.userId}, 챕터 ${params.chapterId}`
    );

    const allProgress = this.getAllProgress();
    const key = `${params.userId}_${params.chapterId}`;
    const now = new Date().toISOString();

    if (!allProgress[key]) {
      allProgress[key] = {
        id: key,
        userId: params.userId,
        chapterId: params.chapterId,
        courseId: params.courseId || 1,
        currentTime: 0,
        totalDuration: 0,
        watchedPercentage: 0,
        isCompleted: false,
        totalWatchTime: 0,
        sessionCount: 1,
        watchSpeed: 1,
        firstWatchedAt: now,
        lastWatchedAt: now,
        completedAt: null,
      };

      this.saveAllProgress(allProgress);
      console.log(`✅ 진행률 생성 완료: ${key}`);
    } else {
      console.log(`ℹ️ 기존 진행률 반환: ${key}`);
    }

    return allProgress[key];
  }

  // 🔥 2. 진행률 업데이트
  static updateWatchProgress(
    userId: string,
    chapterId: number,
    updates: UpdateWatchProgressParams
  ): WatchProgress | null {
    const allProgress = this.getAllProgress();
    const key = `${userId}_${chapterId}`;
    const now = new Date().toISOString();

    if (allProgress[key]) {
      // 완료 조건 체크 (90% 이상 시청 시 자동 완료)
      const isCompleted =
        updates.watchedPercentage && updates.watchedPercentage >= 90;

      allProgress[key] = {
        ...allProgress[key],
        ...updates,
        isCompleted: isCompleted || updates.isCompleted || false,
        lastWatchedAt: now,
        completedAt: isCompleted ? now : allProgress[key].completedAt,
        sessionCount: allProgress[key].sessionCount + 1,
      };

      this.saveAllProgress(allProgress);

      // 🔥 저장 시점 상세 로그 추가
      console.log(`💾 진행률 저장 완료:`, {
        userId,
        chapterId,
        currentTime: updates.currentTime,
        watchedPercentage: updates.watchedPercentage?.toFixed(1) + "%",
        isCompleted,
        저장시각: now,
        전체저장데이터: JSON.stringify(allProgress[key], null, 2),
      });

      return allProgress[key];
    } else {
      console.log(`❌ 진행률 업데이트 실패: ${key} 데이터가 없습니다.`);
      return null;
    }
  }

  static getWatchProgress(
    userId: string,
    chapterId: number
  ): WatchProgress | null {
    // 🔥 호출 스택 추적
    console.trace(`📊 진행률 조회 호출:`, `${userId}_${chapterId}`);

    const allProgress = this.getAllProgress();
    const key = `${userId}_${chapterId}`;
    const progress = allProgress[key] || null;

    if (progress) {
      console.log(
        `📊 진행률 조회: ${key} → ${progress.watchedPercentage.toFixed(1)}%`
      );
    }

    return progress;
  }

  // 🔥 4. 사용자 전체 진행률 요약
  static getUserProgressSummary(
    userId: string,
    totalChapters: number = 6
  ): UserProgressSummary {
    const allProgress = this.getAllProgress();
    const userProgress = Object.values(allProgress).filter(
      (p) => p.userId === userId
    );

    const completedChapters = userProgress.filter((p) => p.isCompleted).length;
    const overallProgress =
      totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;
    const totalWatchTime = userProgress.reduce(
      (sum, p) => sum + p.totalWatchTime,
      0
    );

    // 마지막 시청 챕터 찾기
    const lastWatched = userProgress.sort(
      (a, b) =>
        new Date(b.lastWatchedAt).getTime() -
        new Date(a.lastWatchedAt).getTime()
    )[0];

    const currentChapter = this.getNextChapterToWatch(userId, totalChapters);

    const summary = {
      userId,
      courseId: 1,
      totalChapters,
      completedChapters,
      overallProgress,
      totalWatchTime,
      lastActiveAt: lastWatched?.lastWatchedAt || "",
      currentChapter,
      lastWatchedChapter: lastWatched?.chapterId || 1,
      lastWatchedTime: lastWatched?.currentTime || 0,
    };

    console.log(
      `📈 진행률 요약 - ${userId}: ${completedChapters}/${totalChapters} (${overallProgress.toFixed(
        1
      )}%)`
    );
    return summary;
  }

  // 🔥 5. 다음에 볼 챕터 결정 (이어보기 로직)
  static getNextChapterToWatch(userId: string, totalChapters: number): number {
    const allProgress = this.getAllProgress();
    const userProgress = Object.values(allProgress)
      .filter((p) => p.userId === userId)
      .sort((a, b) => a.chapterId - b.chapterId);

    // 완료되지 않은 첫 번째 챕터 찾기
    for (let i = 1; i <= totalChapters; i++) {
      const progress = userProgress.find((p) => p.chapterId === i);
      if (!progress || !progress.isCompleted) {
        return i;
      }
    }

    return 1; // 모든 챕터 완료 시 첫 번째 챕터 반환
  }

  // 🔥 6. 마지막 시청 지점 가져오기
  static getLastWatchPosition(userId: string, chapterId: number): number {
    const progress = this.getWatchProgress(userId, chapterId);
    return progress?.currentTime || 0;
  }

  // 🔥 7. 챕터 완료 처리
  static completeChapter(userId: string, chapterId: number): void {
    this.updateWatchProgress(userId, chapterId, {
      isCompleted: true,
      watchedPercentage: 100,
    });
    console.log(`🎉 챕터 완료: ${userId}_${chapterId}`);
  }

  // 🔥 8. 사용자 데이터 삭제
  static clearAllUserData(userId: string): void {
    const allProgress = this.getAllProgress();
    const filteredProgress = Object.keys(allProgress)
      .filter((key) => !key.startsWith(`${userId}_`))
      .reduce((obj, key) => {
        obj[key] = allProgress[key];
        return obj;
      }, {} as Record<string, WatchProgress>);

    this.saveAllProgress(filteredProgress);
    console.log(`🗑️ 사용자 데이터 삭제 완료: ${userId}`);
  }

  // 🔥 9. 사용자별 모든 진행률 데이터 가져오기
  static getAllUserProgress(userId: string): WatchProgress[] {
    const allProgress = this.getAllProgress();
    return Object.values(allProgress)
      .filter((p) => p.userId === userId)
      .sort((a, b) => a.chapterId - b.chapterId);
  }

  // 🔥 10. 실시간 진행률 업데이트 (비디오 재생 중 호출)
  static updateRealTimeProgress(
    userId: string,
    chapterId: number,
    currentTime: number,
    duration: number,
    playbackRate: number = 1.0
  ): void {
    const watchedPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    // 너무 자주 저장하지 않도록 5초마다만 저장
    const now = Date.now();
    const lastSave = parseInt(
      localStorage.getItem(`last_save_${userId}_${chapterId}`) || "0"
    );

    if (now - lastSave > 5000) {
      // 5초 간격
      this.updateWatchProgress(userId, chapterId, {
        currentTime,
        totalDuration: duration,
        watchedPercentage,
        watchSpeed: playbackRate,
      });
      localStorage.setItem(`last_save_${userId}_${chapterId}`, now.toString());
    }
  }
}
