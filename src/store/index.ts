import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../auth/auth-slice";
import lectureReducer from "./lecture-slice";
import { authApiSlice } from "../auth/auth-api-slice";
import { lectureApiSlice } from "./lecture-api-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lecture: lectureReducer,
    authApi: authApiSlice.reducer,
    lectureApi: lectureApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApiSlice.middleware)
      .concat(lectureApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
