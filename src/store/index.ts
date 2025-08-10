import { configureStore } from "@reduxjs/toolkit";
import courseDetailReducer from "./courseDetailSlice";

export const store = configureStore({
  reducer: {
    courseDetail: courseDetailReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
