import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProgressState {
  cachedProgress: Record<number, any>;
  completedChapters: Set<number>;
  chapterProgress: Record<number, number>;
}

const initialState: ProgressState = {
  cachedProgress: {},
  completedChapters: new Set(),
  chapterProgress: {},
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
  },
});

export const {
  setCachedProgress,
  setCompletedChapters,
  setChapterProgress,
  updateChapterProgress,
  addCompletedChapter,
} = progressSlice.actions;

export default progressSlice.reducer;
