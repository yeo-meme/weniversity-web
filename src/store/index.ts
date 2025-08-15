import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../auth/authSlice";
import { authApiSlice } from "../auth/authApiSlice";
import { lectureApiSlice } from "./slices/lecture-api-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
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
