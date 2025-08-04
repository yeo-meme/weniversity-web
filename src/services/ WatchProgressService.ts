import { WatchProgress, UpdateWatchProgressParams } from '../types/video';
import { chaptersData } from '../data/chapters';


  export class WatchProgressService {
    private static readonly STORAGE_PREFIX = 'watch_progress_';
    private static readonly COMPLETION_THRESHOLD = 90; // 90% 이상 시청시 완료
  
    // 진행률 데이터 생성 (사용자가 비디오를 처음 시청할 때)
    static createWatchProgress({ 
      userId, 
      chapterId, 
      courseId = 1 
    }: CreateWatchProgressParams): WatchProgress | null {
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
  