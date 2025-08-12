import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProgressState {
  cachedProgress: Record<number, any>;
  completedChapters: Set<number>;
  chapterProgress: Record<number, number>;

  currentTime: number;
  currentVideoIndex: number;
  isInitialized: boolean;

  hasProgressData: boolean;      // 🔥 새로 추가
  isVideoPlaying: boolean;       // 🔥 새로 추가
  lastSaveTime: number; 
}

const initialState: ProgressState = {
  cachedProgress: {},
  completedChapters: new Set(),
  chapterProgress: {},

  currentTime: 0,
  currentVideoIndex: 0,
  isInitialized: false,

  hasProgressData: false,        // 🔥 새로 추가
  isVideoPlaying: false,         // 🔥 새로 추가
  lastSaveTime: 0,   
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setCachedProgress(state, action: PayloadAction<Record<number, any>>) {
      state.cachedProgress = action.payload;
    },
    setCompletedChapters(state, action: PayloadAction<Set<number>>) {
      state.completedChapters = action.payload;
    },
    setChapterProgress(state, action: PayloadAction<Record<number, number>>) {
      state.chapterProgress = action.payload;
    },
    updateChapterProgress(state, action: PayloadAction<{ chapterIndex: number; progress: number }>) {
      state.chapterProgress[action.payload.chapterIndex] = action.payload.progress;
    },
    addCompletedChapter(state, action: PayloadAction<number>) {
      state.completedChapters.add(action.payload);
    },
      // 🔥 새로 추가할 리듀서들
      setCurrentTime(state, action: PayloadAction<number>) {
        state.currentTime = action.payload;
      },
      setCurrentVideoIndex(state, action: PayloadAction<number>) {
        state.currentVideoIndex = action.payload;
      },
      setIsInitialized(state, action: PayloadAction<boolean>) {
        state.isInitialized = action.payload;
      },

         // 🔥 새로 추가할 리듀서들
    setHasProgressData(state, action: PayloadAction<boolean>) {
      state.hasProgressData = action.payload;
    },
    setIsVideoPlaying(state, action: PayloadAction<boolean>) {
      state.isVideoPlaying = action.payload;
    },
    setLastSaveTime(state, action: PayloadAction<number>) {
      state.lastSaveTime = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProgressFromServer.pending, (state) => {
        state.isInitialized = false;
      })
      .addCase(loadProgressFromServer.fulfilled, (state, action) => {
        const serverData = action.payload;
        state.cachedProgress = convertToCache(serverData.chapters);
        state.hasProgressData = true;
        state.isInitialized = true;
      })
      .addCase(loadProgressFromServer.rejected, (state) => {
        state.isInitialized = true;
        state.hasProgressData = false;
      });
  },
});

export const {
  setCachedProgress,
  setCompletedChapters,
  setChapterProgress,
  updateChapterProgress,
  addCompletedChapter,
  // 🔥 새로 추가할 액션들
  setCurrentTime,
  setCurrentVideoIndex,
  setIsInitialized,

  // 🔥 새로 추가할 액션들
  setHasProgressData,
  setIsVideoPlaying,
  setLastSaveTime,
} = progressSlice.actions;

export default progressSlice.reducer;
