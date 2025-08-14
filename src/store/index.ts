import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../auth/auth-slice";
import { authApiSlice } from "../auth/auth-api-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    authApi: authApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
