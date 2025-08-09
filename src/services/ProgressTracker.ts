import type {
  WatchProgress,
  CreateWatchProgressParams,
  UpdateWatchProgressParams,
  UserProgressSummary,
  LocalChapterCache,
  LocalProgressCache,
} from "../types/progress.types";
import { localChapterToWatchProgress } from "../utils/convertCacheToWatchProgress";
import { convertCacheToWatchProgress } from "../utils/convertCacheToWatchProgress";

export class ProgressTracker {
  // private static readonly STORAGE_KEY = "video_watch_progress";
  private static readonly LOCAL_CACHE_KEY = "local_progress_cache";

  // 로컬: 모든 진행률 데이터 가져오기
  private static getAllProgress(): Record<string, WatchProgress> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  // 로컬 : 진행률 데이터 저장
  private static saveAllProgress(data: Record<string, WatchProgress>): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  // 🔥 로컬: 백업 저장 (기존 getAllProgress/saveAllProgress 활용)
  // private static saveToLocalBackup(userId: string, chapterId: number, progress: WatchProgress): void {
  //   const allProgress = this.getAllProgress();
  //   const key = `${userId}_${chapterId}`;
  //   allProgress[key] = progress;
  //   this.saveAllProgress(allProgress);
  // }

  /* 통합된 저장 로직 */
  static async saveProgress(
    userId: string,
    courseId: number,
    chapterId: number,
    localChapter: LocalChapterCache,
    options?: {
      forceComplete?: boolean;
      skipValidation?: boolean;
    }
  ): Promise<WatchProgress | null> {
    try {
      // 🔥 진행률 자동 계산 로직 추가
      const watchedPercentage =
        localChapter.totalDuration > 0
          ? (localChapter.currentTime / localChapter.totalDuration) * 100
          : 0;

      // 🔥 완료 상태 자동 판단
      const isCompleted =
        options?.forceComplete ||
        localChapter.isCompleted ||
        watchedPercentage >= 90;

      // LocalChapterCache를 WatchProgress로 변환
      const progress = localChapterToWatchProgress(
        userId,
        courseId,
        chapterId,
        {
          ...localChapter,
          watchedPercentage,
          isCompleted,
          lastUpdated: Date.now(),
        }
      );

      // 서버에 저장
      const response = await fetch(
        "http://localhost:8000/api/watch-progress/save/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: progress.userId,
            courseId: progress.courseId,
            chapterId: progress.chapterId,
            currentTime: progress.currentTime,
            totalDuration: progress.totalDuration,
            watchedPercentage: progress.watchedPercentage,
            isCompleted: progress.isCompleted,
            totalWatchTime: progress.totalWatchTime,
            sessionCount: progress.sessionCount,
            watchSpeed: progress.watchSpeed,
            firstWatchedAt: progress.firstWatchedAt,
            lastWatchedAt: progress.lastWatchedAt,
            completedAt: progress.completedAt,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const serverData = await response.json();

      // 🔥 로컬 스토리지에도 백업 저장
      this.saveToLocalBackup(userId, chapterId, progress);

      console.log(
        `💾 진행률 저장 완료: ${chapterId} - ${watchedPercentage.toFixed(1)}%`
      );
      return serverData;
    } catch (error) {
      console.error("❌ 서버 저장 실패:", error);

      // 🔄 오프라인 대비: 로컬 백업만 저장
      const progress = localChapterToWatchProgress(
        userId,
        courseId,
        chapterId,
        localChapter
      );
      this.saveToLocalBackup(userId, chapterId, progress);
      console.log("📴 오프라인 모드: 로컬 백업 저장됨");

      return progress;
    }
  }

  //  // 로컬 캐시(간단한 LocalCourseCache 형태) 불러오기
  //  static getLocalCache(): LocalProgressCache {
  //   const stored = localStorage.getItem(this.LOCAL_CACHE_KEY);
  //   return stored ? JSON.parse(stored) : {};
  // }

  // 🔥 1. 새 진행률 생성 : 로컬테스트완료
  // static createWatchProgress(params: CreateWatchProgressParams): WatchProgress {
  //   console.log(
  //     `🔧 진행률 생성: 사용자 ${params.userId}, 챕터 ${params.chapterId}`
  //   );

  //   const allProgress = this.getAllProgress();
  //   const key = `${params.userId}_${params.chapterId}`;
  //   const now = new Date().toISOString();

  //   if (!allProgress[key]) {
  //     allProgress[key] = {
  //       id: key,
  //       userId: params.userId,
  //       chapterId: params.chapterId,
  //       courseId: params.courseId || 1,
  //       currentTime: 0,
  //       totalDuration: 0,
  //       watchedPercentage: 0,
  //       isCompleted: false,
  //       totalWatchTime: 0,
  //       sessionCount: 1,
  //       watchSpeed: 1,
  //       firstWatchedAt: now,
  //       lastWatchedAt: now,
  //       completedAt: null,
  //     };

  //     this.saveAllProgress(allProgress);
  //     console.log(`✅ 진행률 생성 완료: ${key}`);
  //   } else {
  //     console.log(`ℹ️ 기존 진행률 반환: ${key}`);
  //   }

  //   return allProgress[key];
  // }
  // static async createWatchProgress(
  //   userId: string,
  //   courseId: number,
  //   chapterId: number,
  //   localChapter: LocalChapterCache
  // ): Promise<WatchProgress | null> {
  //   // localChapterToWatchProgress로 변환
  //   const progress = localChapterToWatchProgress(
  //     userId,
  //     courseId,
  //     chapterId,
  //     localChapter
  //   );

  //   try {
  //     const response = await fetch(
  //       "http://localhost:8000/api/watch-progress/",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(progress),
  //       }
  //     );

  //     if (!response.ok) {
  //       console.error("서버 저장 실패:", response.statusText);
  //       return null;
  //     }

  //     const data = await response.json();
  //     console.log("서버 저장 성공:", data);
  //     return progress;
  //   } catch (error) {
  //     console.error("서버 저장 중 에러:", error);
  //     return null;
  //   }
  // }

  // 🔥 2. 로컬테스트 완료 진행률 업데이트
  // static updateWatchProgress(
  //   userId: string,
  //   chapterId: number,
  //   updates: UpdateWatchProgressParams
  // ): WatchProgress | null {
  //   const allProgress = this.getAllProgress();
  //   const key = `${userId}_${chapterId}`;
  //   const now = new Date().toISOString();

  //   if (allProgress[key]) {
  //     // 완료 조건 체크 (90% 이상 시청 시 자동 완료)
  //     const isCompleted =
  //       updates.watchedPercentage && updates.watchedPercentage >= 90;

  //     allProgress[key] = {
  //       ...allProgress[key],
  //       ...updates,
  //       isCompleted: isCompleted || updates.isCompleted || false,
  //       lastWatchedAt: now,
  //       completedAt: isCompleted ? now : allProgress[key].completedAt,
  //       sessionCount: allProgress[key].sessionCount + 1,
  //     };

  //     this.saveAllProgress(allProgress);

  //     // 🔥 저장 시점 상세 로그 추가
  //     console.log(`💾 진행률 저장 완료:`, {
  //       userId,
  //       chapterId,
  //       currentTime: updates.currentTime,
  //       watchedPercentage: updates.watchedPercentage?.toFixed(1) + "%",
  //       isCompleted,
  //       저장시각: now,
  //       전체저장데이터: JSON.stringify(allProgress[key], null, 2),
  //     });

  //     return allProgress[key];
  //   } else {
  //     console.log(`❌ 진행률 업데이트 실패: ${key} 데이터가 없습니다.`);
  //     return null;
  //   }
  // }

  // static async updateWatchProgress(
  //   userId: string,
  //   courseId: number,
  //   chapterId: number,
  //   updates: UpdateWatchProgressParams
  // ): Promise<WatchProgress | null> {
  //   try {
  //     // 현재 로컬 데이터 가져오기
  //     const allProgress = this.getAllProgress();
  //     const key = `${userId}_${chapterId}`;
  //     const now = new Date().toISOString();

  //     if (!allProgress[key]) {
  //       console.log(`❌ 진행률 업데이트 실패: ${key} 데이터가 없습니다.`);
  //       return null;
  //     }

  //     // 완료 조건 체크 (90% 이상 시청 시 자동 완료)
  //     const isCompleted = updates.watchedPercentage && updates.watchedPercentage >= 90;

  //     // 업데이트된 데이터 생성
  //     const updatedProgress = {
  //       ...allProgress[key],
  //       ...updates,
  //       isCompleted: isCompleted || updates.isCompleted || false,
  //       lastWatchedAt: now,
  //       completedAt: isCompleted ? now : allProgress[key].completedAt,
  //       sessionCount: allProgress[key].sessionCount + 1,
  //     };

  //     // LocalChapterCache 형태로 변환
  //     const localChapter: LocalChapterCache = {
  //       currentTime: updatedProgress.currentTime,
  //       totalDuration: updatedProgress.totalDuration,
  //       watchedPercentage: updatedProgress.watchedPercentage,
  //       isCompleted: updatedProgress.isCompleted,
  //       lastUpdated: Date.now(),
  //       completedAt: updatedProgress.completedAt,
  //     };

  //     // 🚀 API 호출로 서버에 저장
  //     const response = await fetch(
  //       "http://localhost:8000/api/watch-progress/save/",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           userId,
  //           courseId,
  //           chapterId,
  //           currentTime: updatedProgress.currentTime,
  //           totalDuration: updatedProgress.totalDuration,
  //           watchedPercentage: updatedProgress.watchedPercentage,
  //           isCompleted: updatedProgress.isCompleted,
  //           totalWatchTime: updatedProgress.totalWatchTime,
  //           sessionCount: updatedProgress.sessionCount,
  //           watchSpeed: updatedProgress.watchSpeed,
  //           firstWatchedAt: updatedProgress.firstWatchedAt,
  //           lastWatchedAt: updatedProgress.lastWatchedAt,
  //           completedAt: updatedProgress.completedAt,
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`Server error: ${response.statusText}`);
  //     }

  //     const serverData = await response.json();

  //     // 로컬 스토리지도 업데이트
  //     allProgress[key] = updatedProgress;
  //     this.saveAllProgress(allProgress);

  //     // 🔥 저장 시점 상세 로그
  //     console.log(`💾 진행률 저장 완료:`, {
  //       userId,
  //       chapterId,
  //       currentTime: updates.currentTime,
  //       watchedPercentage: updates.watchedPercentage?.toFixed(1) + "%",
  //       isCompleted,
  //       저장시각: now,
  //       서버응답: serverData.created ? "새로 생성됨" : "업데이트됨",
  //     });

  //     return serverData;

  //   } catch (error) {
  //     console.error("❌ 서버 저장 실패:", error);

  //     // 🔄 오프라인 대비: 로컬만 저장
  //     const allProgress = this.getAllProgress();
  //     const key = `${userId}_${chapterId}`;
  //     const now = new Date().toISOString();

  //     if (allProgress[key]) {
  //       const isCompleted = updates.watchedPercentage && updates.watchedPercentage >= 90;

  //       allProgress[key] = {
  //         ...allProgress[key],
  //         ...updates,
  //         isCompleted: isCompleted || updates.isCompleted || false,
  //         lastWatchedAt: now,
  //         completedAt: isCompleted ? now : allProgress[key].completedAt,
  //         sessionCount: allProgress[key].sessionCount + 1,
  //       };

  //       this.saveAllProgress(allProgress);
  //       console.log("📴 오프라인 모드: 로컬만 저장됨");
  //       return allProgress[key];
  //     }

  //     return null;
  //   }
  // }

  //api 테스트
  // static async saveProgress(
  //   userId: string,
  //   courseId: number,
  //   chapterId: number,
  //   localChapter: LocalChapterCache
  // ): Promise<WatchProgress | null> {

  //   try {
  //     const progress = localChapterToWatchProgress(userId, courseId, chapterId, localChapter);
  //     // 서버에 Upsert 요청 (create/update 구분 없음)
  //     const response = await fetch(
  //       "http://localhost:8000/api/watch-progress/save/",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           userId: progress.userId,
  //           courseId: progress.courseId,
  //           chapterId: progress.chapterId,
  //           currentTime: progress.currentTime,
  //           totalDuration: progress.totalDuration,
  //           watchedPercentage: progress.watchedPercentage,
  //           isCompleted: progress.isCompleted,
  //           totalWatchTime: progress.totalWatchTime,
  //           sessionCount: progress.sessionCount,
  //           watchSpeed: progress.watchSpeed,
  //           firstWatchedAt: progress.firstWatchedAt,
  //           lastWatchedAt: progress.lastWatchedAt,
  //           completedAt: progress.completedAt,
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`Server error: ${response.statusText}`);
  //     }
  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.error("❌ 서버 저장 실패:", error);
  //   }
  // }

  //통합api테스트

  // 코스 전체 진행률 조회  /* API 조회 */
  static async getCourseProgress(
    userId: string,
    courseId: number
  ): Promise<any> {
    try {
      const response = await fetch(
        `http://localhost:8000/api/watch-progress/${userId}/${courseId}/`
      );

      if (!response.ok) throw new Error("Failed to fetch");

      return await response.json();
    } catch (error) {
      console.error("조회 실패:", error);
      return null;
    }
  }

  /* 로컬 조회: 인데 따로 쓰고있어 컴포넌트호출없음 */
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

  // 🔥 4. 사용자 전체 진행률 요약 /* 요약 정보 */
  
  //컴포넌트 호출은있음
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

  // 🔥 : 컴포넌트 호출없음 5. 다음에 볼 챕터 결정 (이어보기 로직)
  // static getNextChapterToWatch(userId: string, totalChapters: number): number {
  //   const allProgress = this.getAllProgress();
  //   const userProgress = Object.values(allProgress)
  //     .filter((p) => p.userId === userId)
  //     .sort((a, b) => a.chapterId - b.chapterId);

  //   // 완료되지 않은 첫 번째 챕터 찾기
  //   for (let i = 1; i <= totalChapters; i++) {
  //     const progress = userProgress.find((p) => p.chapterId === i);
  //     if (!progress || !progress.isCompleted) {
  //       return i;
  //     }
  //   }

  //   return 1; // 모든 챕터 완료 시 첫 번째 챕터 반환
  // }

  // 🔥 : 컴포넌트 호출없음 6. 마지막 시청 지점 가져오기/* 마지막 위치 */
  // static getLastWatchPosition(userId: string, chapterId: number): number {
  //   const progress = this.getWatchProgress(userId, chapterId);
  //   return progress?.currentTime || 0;
  // }

  // 🔥 7. 챕터 완료 처리
  // static completeChapter(userId: string, chapterId: number): void {
  //   this.updateWatchProgress(userId, chapterId, {
  //     isCompleted: true,
  //     watchedPercentage: 100,
  //   });
  //   console.log(`🎉 챕터 완료: ${userId}_${chapterId}`);
  // }

  // 🔥 8. 사용자 데이터 삭제/* 테스트용 */
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

  // ✅ 간소화된 완료 처리
  static async completeChapter(
    userId: string,
    courseId: number,
    chapterId: number
  ): Promise<void> {
    const currentProgress = this.getWatchProgress(userId, chapterId);
    if (currentProgress) {
      await this.saveProgress(
        userId,
        courseId,
        chapterId,
        {
          currentTime: currentProgress.currentTime,
          totalDuration: currentProgress.totalDuration,
          watchedPercentage: 100,
          isCompleted: true,
          lastUpdated: Date.now(),
        },
        { forceComplete: true }
      );
    }
  }

  // 🔥 누락된 메서드 추가
  private static saveToLocalBackup(userId: string, chapterId: number, progress: WatchProgress): void {
    const allProgress = this.getAllProgress();
    const key = `${userId}_${chapterId}`;
    allProgress[key] = progress;
    this.saveAllProgress(allProgress);
    console.log(`💾 로컬 백업 저장 완료: ${key}`);
  }

  // 🔥 10. 실시간 진행률 업데이트 (비디오 재생 중 호출)
  // static updateRealTimeProgress(
  //   userId: string,
  //   chapterId: number,
  //   currentTime: number,
  //   duration: number,
  //   playbackRate: number = 1.0
  // ): void {
  //   const watchedPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  //   // 너무 자주 저장하지 않도록 5초마다만 저장
  //   const now = Date.now();
  //   const lastSave = parseInt(
  //     localStorage.getItem(`last_save_${userId}_${chapterId}`) || "0"
  //   );

  //   if (now - lastSave > 5000) {
  //     // 5초 간격
  //     this.updateWatchProgress(userId, chapterId, {
  //       currentTime,
  //       totalDuration: duration,
  //       watchedPercentage,
  //       watchSpeed: playbackRate,
  //     });
  //     localStorage.setItem(`last_save_${userId}_${chapterId}`, now.toString());
  //   }
  // }
}
