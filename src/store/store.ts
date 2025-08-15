import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "../auth/authSlice";
import { authApiSlice } from "../auth/authApiSlice";
import { lectureApiSlice } from "./slices/lectureApiSlice";
import pageReducer from "./slices/pageSlice";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "refreshToken", "user"],
};

const pagePersistConfig = {
  key: "page",
  storage,
  whitelist: ["currentTab"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  page: persistReducer(pagePersistConfig, pageReducer),
  [authApiSlice.reducerPath]: authApiSlice.reducer,
  [lectureApiSlice.reducerPath]: lectureApiSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(authApiSlice.middleware)
      .concat(lectureApiSlice.middleware),
});

export const persistor = persistStore(store);

persistor.subscribe(() => {
  const bootstrapped = persistor.getState().bootstrapped;
  if (bootstrapped) {
    const state = store.getState();
    console.log("REHYDRATE 완료!");
    console.log("auth:", state.auth);
    console.log("page:", state.page);
    console.log("👤 user:", state.auth.user);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
