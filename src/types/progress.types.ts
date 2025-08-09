// // 타입 정의
// export interface WatchProgress {
//   id: string; // userId_chapterId 형태
//   userId: string;
//   chapterId: number;
//   courseId: number;
//   currentTime: number; // 현재 재생 위치 (초)
//   totalDuration: number; // 비디오 전체 길이 (초)
//   watchedPercentage: number; // 시청률 (%)
//   isCompleted: boolean; // 완료 여부
//   totalWatchTime: number; // 실제 시청한 시간 (밀리초)
//   sessionCount: number; // 시청 세션 수
//   watchSpeed: number; // 재생 속도
//   firstWatchedAt: string; // 첫 시청 시각
//   lastWatchedAt: string; // 마지막 시청 시각
//   completedAt: string | null; // 완료 시각
// }

// export interface CreateWatchProgressParams {
//   userId: string;
//   chapterId: number;
//   courseId?: number;
// }

// export interface UpdateWatchProgressParams {
//   currentTime?: number;
//   totalDuration?: number;
//   watchedPercentage?: number;
//   totalWatchTime?: number;
//   sessionCount?: number;
//   watchSpeed?: number;
//   isCompleted?: boolean;
// }

// export interface UserProgressSummary {
//   userId: string;
//   courseId: number;
//   totalChapters: number;
//   completedChapters: number;
//   overallProgress: number;
//   totalWatchTime: number;
//   lastActiveAt: string;
//   currentChapter: number;
//   lastWatchedChapter: number;
//   lastWatchedTime: number;
// }

//   export interface LocalChapterCache {
//     currentTime: number;
//     lastUpdated: number;
//     isDirty: boolean;
//   }
  


//   export interface LocalChapterCache {
//     currentTime: number;
//     lastUpdated: number;
//     isDirty: boolean;
//   }
  
//   export interface LocalCourseCache {
//     userId: string;
//     courseId: number;
//     chapterOrder: number[]; // UI에 필요한 경우
//     chapters: {
//       [chapterId: number]: LocalChapterCache;
//     };
//   }
  
  

//   export interface ServerProgress {
//     userId: string;
//     courseId: number;
//     sectionId?: number; // 서버에 sectionId가 있다면 추가
//     chapterId: number;
//     currentTime: number;
//     totalDuration: number;
//     watchedPercentage: number;
//     isCompleted: boolean;
//     totalWatchTime: number;
//     sessionCount: number;
//     watchSpeed: number;
//     firstWatchedAt: string;
//     lastWatchedAt: string;
//     completedAt: string | null;
//   }

// types/progress.types.ts

// 1. DB/ProgressTracker용 타입
export interface WatchProgress {
  id: string;
  userId: string;
  chapterId: number;
  courseId: number;
  currentTime: number;
  totalDuration: number;
  watchedPercentage: number;
  isCompleted: boolean;
  totalWatchTime: number;
  sessionCount: number;
  watchSpeed: number;
  firstWatchedAt: string;
  lastWatchedAt: string;
  completedAt: string | null;
}
//사용자가 동영상어디까지 사용자 개별 테이블 - 
// 2. LocalStorage용 간소화된 타입
export interface LocalChapterCache {
  currentTime: number;
  totalDuration: number; 
  watchedPercentage: number;  
  isCompleted: boolean;  // ✅ 추가
  lastUpdated: number;
  isDirty: boolean;
}

// 3. 코스별 캐시
export interface LocalCourseCache {
  userId: string;
  courseId: number;
  courseTitle?: string;
  chapterOrder: number[];
  chapters: {
    [chapterId: number]: LocalChapterCache;
  };
}

// 4. 전체 LocalStorage 구조
export interface LocalProgressCache {
  [userCourseKey: string]: LocalCourseCache;  // "user123_course1" 형식
}

export interface CreateWatchProgressParams {
  userId: string;
  chapterId: number;
  courseId?: number;
}

export interface UpdateWatchProgressParams {
  currentTime?: number;
  totalDuration?: number;
  watchedPercentage?: number;
  totalWatchTime?: number;
  sessionCount?: number;
  watchSpeed?: number;
  isCompleted?: boolean;
}