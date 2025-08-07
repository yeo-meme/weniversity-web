// 📋 타입 정의
interface Chapter {
  id: number;
  title: string;
  videoFile: string;
  durationSeconds: number;
  time: string;        // "15:00" 형태
  duration: string;    // "8:00" 형태
}

interface ChapterProgress {
  id?: number;
  userId: string;
  chapterId: number;
  courseId: number;
  currentTime: number;
  totalDuration: number;
  watchedPercentage: number;
  isCompleted: boolean;
  watchSpeed: number;
  lastWatchedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Course {
  id: number;
  title: string;
  description: string;
  chapters: Chapter[];
  totalDuration: number;
  thumbnailUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProgressCalculator {
  
  /**
   * 총 시청 시간 계산
   */
  static getTotalWatchTime(
    chapters: Chapter[], 
    progressMap: Record<number, ChapterProgress>
  ): number {
    return chapters.reduce((total, chapter) => {
      const progress = progressMap[chapter.id];
      if (!progress) return total;
      
      return total + (progress.isCompleted 
        ? chapter.durationSeconds 
        : progress.currentTime);
    }, 0);
  }

  /**
   * 전체 진행률 계산 (퍼센트)
   */
  static getOverallProgress(
    chapters: Chapter[], 
    progressMap: Record<number, ChapterProgress>
  ): number {
    const totalDuration = chapters.reduce((sum, ch) => sum + ch.durationSeconds, 0);
    if (totalDuration === 0) return 0;

    const watchedTime = this.getTotalWatchTime(chapters, progressMap);
    return Math.min((watchedTime / totalDuration) * 100, 100);
  }

  /**
   * 예상 남은 시간 계산
   */
  static getEstimatedRemaining(
    chapters: Chapter[], 
    progressMap: Record<number, ChapterProgress>
  ): number {
    const totalDuration = chapters.reduce((sum, ch) => sum + ch.durationSeconds, 0);
    const watchedTime = this.getTotalWatchTime(chapters, progressMap);
    return Math.max(totalDuration - watchedTime, 0);
  }

  /**
   * 완료된 챕터 수 계산
   */
  static getCompletedChapterCount(progressMap: Record<number, ChapterProgress>): number {
    return Object.values(progressMap).filter(progress => progress.isCompleted).length;
  }

  /**
   * 다음 시청할 챕터 찾기
   */
  static getNextChapterToWatch(
    chapters: Chapter[], 
    progressMap: Record<number, ChapterProgress>
  ): number | null {
    // 진행 중인 챕터가 있으면 그것을 반환
    for (const chapter of chapters) {
      const progress = progressMap[chapter.id];
      if (progress && !progress.isCompleted && progress.currentTime > 0) {
        return chapter.id;
      }
    }

    // 진행 중인 챕터가 없으면 첫 번째 미완료 챕터 반환
    for (const chapter of chapters) {
      const progress = progressMap[chapter.id];
      if (!progress || !progress.isCompleted) {
        return chapter.id;
      }
    }

    return null;
  }

  /**
   * 특정 챕터의 진행률 계산
   */
  static getChapterProgress(
    chapterDuration: number, 
    currentTime: number
  ): number {
    if (chapterDuration === 0) return 0;
    return Math.min((currentTime / chapterDuration) * 100, 100);
  }

  /**
   * 시간 포맷팅 (초 → "MM:SS" 또는 "HH:MM:SS")
   */
  static formatTime(seconds: number): string {
    const roundedSeconds = Math.floor(seconds);
    const hrs = Math.floor(roundedSeconds / 3600);
    const mins = Math.floor((roundedSeconds % 3600) / 60);
    const secs = roundedSeconds % 60;
    
    return hrs > 0
      ? `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      : `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  /**
   * 진행률 요약 정보 생성
   */
  static generateProgressSummary(
    chapters: Chapter[], 
    progressMap: Record<number, ChapterProgress>
  ) {
    const totalChapters = chapters.length;
    const completedChapters = this.getCompletedChapterCount(progressMap);
    const overallProgress = this.getOverallProgress(chapters, progressMap);
    const totalWatchTime = this.getTotalWatchTime(chapters, progressMap);
    const estimatedRemaining = this.getEstimatedRemaining(chapters, progressMap);

    return {
      totalChapters,
      completedChapters,
      overallProgress,
      totalWatchTime,
      estimatedRemaining,
      formattedWatchTime: this.formatTime(totalWatchTime),
      formattedRemainingTime: this.formatTime(estimatedRemaining),
      completionRate: totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0
    };
  }

  /**
   * 챕터 완료 여부 판단 (90% 이상 시청 시 완료)
   */
  static isChapterCompleted(currentTime: number, totalDuration: number): boolean {
    if (totalDuration === 0) return false;
    return (currentTime / totalDuration) >= 0.9;
  }
}