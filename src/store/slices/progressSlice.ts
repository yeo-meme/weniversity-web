import { createSlice } from '@reduxjs/toolkit';
import type {  PayloadAction } from '@reduxjs/toolkit';



interface Chapter {
  id: string;
  userId: string;
  courseId: number;
  chapterId: number;
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
  title?: string;
  chapters: Chapter[];
}

interface WatchProgressState {
  userId: string;
  courseId: number;
  chapters: Chapter[];
  totalChapters: number;
  completedChapters: number;
}

interface PlayerState {
  cachedProgress: Record<number, WatchProgressState>;
  realtimeCache: any;
  currentChapterIndex: number;
  currentTime: number;
  duration: number;
  completedChapters: number[];  // 🔥 배열로 변경
  chapterProgress: Record<number, number>;
  startTime: number;
  hasProgressData: boolean;
  isVideoPlaying: boolean;
  lastSaveTime: number;
  expandedGroups: number[];     // 🔥 배열로 변경
  courseTitle: string;
  chapters: Chapter[];
}

const initialState: PlayerState = {
  cachedProgress: {},
  realtimeCache: {},
  currentChapterIndex: -1,
  currentTime: 0,
  duration: 0,
  completedChapters: [],        // 🔥 빈 배열
  chapterProgress: {},
  startTime: 0,
  hasProgressData: false,
  isVideoPlaying: false,
  lastSaveTime: 0,
  expandedGroups: [1, 2],       // 🔥 배열
  courseTitle: "프로그래밍 기초 강의",
  chapters: [],
};


export const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    // 🔥 기본 액션들
    setChapters: (state, action: PayloadAction<Chapter[]>) => {
      state.chapters = action.payload;
      
      // 🔥 완료된 챕터들을 배열로 업데이트
      state.completedChapters = action.payload
        .filter(chapter => chapter.isCompleted)
        .map(chapter => chapter.chapterId)
        .filter((chapterId, index, self) => self.indexOf(chapterId) === index); // 중복 제거
    },
    
    setCourseTitle: (state, action: PayloadAction<string>) => {
      state.courseTitle = action.payload;
    },
    
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    
    setCurrentChapterIndex: (state, action: PayloadAction<number>) => {
      state.currentChapterIndex = action.payload;
    },
    
    setStartTime: (state, action: PayloadAction<number>) => {
      state.startTime = action.payload;
    },
    
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    
    setIsVideoPlaying: (state, action: PayloadAction<boolean>) => {
      state.isVideoPlaying = action.payload;
    },
    
    // 🔥 완료된 챕터 관리 (배열 방식)
    addCompletedChapter: (state, action: PayloadAction<number>) => {
      const chapterId = action.payload;
      if (!state.completedChapters.includes(chapterId)) {
        state.completedChapters.push(chapterId);
      }
    },
    
    removeCompletedChapter: (state, action: PayloadAction<number>) => {
      const chapterId = action.payload;
      state.completedChapters = state.completedChapters.filter(id => id !== chapterId);
    },
    
    setCompletedChapters: (state, action: PayloadAction<number[]>) => {
      state.completedChapters = action.payload;
    },
    
    // 🔥 확장된 그룹 관리 (배열 방식)
    toggleExpandedGroup: (state, action: PayloadAction<number>) => {
      const groupId = action.payload;
      if (state.expandedGroups.includes(groupId)) {
        state.expandedGroups = state.expandedGroups.filter(id => id !== groupId);
      } else {
        state.expandedGroups.push(groupId);
      }
    },
    
    addExpandedGroup: (state, action: PayloadAction<number>) => {
      const groupId = action.payload;
      if (!state.expandedGroups.includes(groupId)) {
        state.expandedGroups.push(groupId);
      }
    },
    
    removeExpandedGroup: (state, action: PayloadAction<number>) => {
      const groupId = action.payload;
      state.expandedGroups = state.expandedGroups.filter(id => id !== groupId);
    },
    
    setExpandedGroups: (state, action: PayloadAction<number[]>) => {
      state.expandedGroups = action.payload;
    },
    
    // 🔥 챕터 진행률 업데이트
    updateChapterProgress: (state, action: PayloadAction<{ chapterId: number; progress: number }>) => {
      const { chapterId, progress } = action.payload;
      state.chapterProgress[chapterId] = progress;
    },
    
    // 🔥 캐시된 진행률 업데이트
    setCachedProgress: (state, action: PayloadAction<{ courseId: number; progress: WatchProgressState }>) => {
      const { courseId, progress } = action.payload;
      state.cachedProgress[courseId] = progress;
    },
    
    // 🔥 진행률 데이터 존재 여부
    setHasProgressData: (state, action: PayloadAction<boolean>) => {
      state.hasProgressData = action.payload;
    },
    
    // 🔥 마지막 저장 시간 업데이트
    updateLastSaveTime: (state) => {
      state.lastSaveTime = Date.now();
    },
    
    // 🔥 상태 초기화
    resetProgressState: (state) => {
      Object.assign(state, initialState);
    },
    
    // 🔥 특정 코스 상태 초기화
    resetCourseState: (state, action: PayloadAction<number>) => {
      const courseId = action.payload;
      delete state.cachedProgress[courseId];
      state.chapters = [];
      state.currentChapterIndex = 0;
      state.currentTime = 0;
      state.startTime = 0;
      state.completedChapters = [];
      state.chapterProgress = {};
      state.hasProgressData = false;
    },
  },
});

export const {
  setChapters,
  setCourseTitle,
  setDuration,
  setCurrentChapterIndex,
  setStartTime,
  setCurrentTime,
  setIsVideoPlaying,
  addCompletedChapter,
  removeCompletedChapter,
  setCompletedChapters,
  toggleExpandedGroup,
  addExpandedGroup,
  removeExpandedGroup,
  setExpandedGroups,
  updateChapterProgress,
  setCachedProgress,
  setHasProgressData,
  updateLastSaveTime,
  resetProgressState,
  resetCourseState,
} = progressSlice.actions;

export default progressSlice.reducer;

// 🔥 셀렉터들 (배열 기반)
export const selectCompletedChapters = (state: { progress: ProgressState }) => state.progress.completedChapters;
export const selectExpandedGroups = (state: { progress: ProgressState }) => state.progress.expandedGroups;
export const selectIsChapterCompleted = (chapterId: number) => (state: { progress: ProgressState }) => 
  state.progress.completedChapters.includes(chapterId);
export const selectIsGroupExpanded = (groupId: number) => (state: { progress: ProgressState }) => 
  state.progress.expandedGroups.includes(groupId);

// 🔥 유틸리티 함수들
export const getCompletedChapterIds = (chapters: Chapter[]): number[] => {
  return chapters
    .filter(chapter => chapter.isCompleted)
    .map(chapter => chapter.chapterId)
    .filter((chapterId, index, self) => self.indexOf(chapterId) === index); // 중복 제거
};

export const getChapterProgress = (chapters: Chapter[]): Record<number, number> => {
  const progress: Record<number, number> = {};
  
  chapters.forEach(chapter => {
    const chapterId = chapter.chapterId;
    if (!progress[chapterId] || progress[chapterId] < chapter.watchedPercentage) {
      progress[chapterId] = chapter.watchedPercentage;
    }
  });
  
  return progress;
};
