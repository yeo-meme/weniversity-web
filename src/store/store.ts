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
import pageReducer from "./slices/pageSlice";


const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "refreshToken", "user"], 
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  page: pageReducer,
  [authApiSlice.reducerPath]: authApiSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(authApiSlice.middleware),
});


export const persistor = persistStore(store, null, () => {
  const state = store.getState();
  console.log("Persist: 복원 완료!");
  console.log("localStorage에서 복원된 auth 상태:", state.auth);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
