import { configureStore } from "@reduxjs/toolkit";
import { authApiSlice } from "../auth/authApiSlice";
import authReducer from "../auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

//개발시
import { lectureApiSlice } from "./slices/lectureApiSlice"; // 추가
import progressReducer from '../store/slices/progressSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    progress: progressReducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [lectureApiSlice.reducerPath]: lectureApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApiSlice.middleware,
      lectureApiSlice.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
