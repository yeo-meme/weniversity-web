import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import profileReducer from "./profileSlice";
import findPasswordReducer from "./findPasswordSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    findPassword: findPasswordReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
