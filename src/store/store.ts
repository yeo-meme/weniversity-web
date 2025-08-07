import { configureStore } from '@reduxjs/toolkit';
import progressReducer from './progressSlice';

export const store = configureStore({
  reducer: {
    progress: progressReducer,
    // 다른 slice 있으면 추가
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
