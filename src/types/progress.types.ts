


//서버 과목 데이터 용
interface Chapter {
  id: number;
  title: string;
  time: string;
  duration: string;
  durationSeconds: number;
  videoFile: string;
  completed: boolean;
  
  type?: 'video' | 'mission';          
  missionId?: number;                  
}


// 시청률 디비 구조 
export interface WatchProgress {
  id: string;
  userId: string;
  chapterId: number;
  courseId: number;
  videoId: number;               
  chapterOrder: number;          
  videoOrder: number;            
  chapterIndex: number;          
  videoIndex: number;            
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


  missionId?: number;                   // 미션 ID (있으면 미션)
  missionScore?: number;                // 미션 점수
  missionPassed?: boolean;   
}

export interface LastWatched {
  lastChapterId: number;
  lastVideoId: number;
  lastChapterOrder: number;
  lastVideoOrder: number;
  lastChapterIndex: number;
  lastVideoIndex: number;
  lastWatchedAt: string;
  currentTime: number; 
}

//사용자가 동영상어디까지 사용자 개별 테이블 - 
// 2. LocalStorage용 간소화된 타입
export interface LocalChapterCache {
  currentTime: number;
  totalDuration: number; 
  watchedPercentage: number;  
  isCompleted: boolean;  
  lastUpdated: number;
  isDirty: boolean;
}

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


export interface CourseProgressStatistics {
  totalChapters: number;
  completedChapters: number;
  totalVideos: number;
  completedVideos: number;
  overallProgress: number;
  isCompleted: boolean;
}

export interface CourseProgressResponse {
  userId: string;
  videoId: number;
  chapters: WatchProgress[];           // WatchProgress 배열
  lastWatched: LastWatched | null;     // 마지막 시청 위치
  statistics: CourseProgressStatistics; // 통계
}