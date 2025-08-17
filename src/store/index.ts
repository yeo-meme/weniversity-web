import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import registerReducer from "./registerSlice";
import myPageReducer from "./myPageSlice";
import findPasswordReducer from "./findPasswordSlice";
import courseReducer from "./courseSlice";
import courseDetailReducer from "./courseDetailSlice";
import homeCourseReducer from "./homeCourseSlice";
import authReducer from "../auth/authSlice";
import { authApiSlice } from "../auth/authApiSlice";
import searchReducer from "./searchSlice";
import myLectureReducer from "./myLecturesSlice";
import { lectureApiSlice } from './lectureApiSlice';
import problemReducer from './problemSlice';
import { missionApiSlice } from '../auth/missionApiSlice';

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: [
    "user",
    "token",
    "refreshToken",
    "isAuthenticated",
    "tokenExpiration",
  ],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  authApi: authApiSlice.reducer,
  register: registerReducer,
  myPage: myPageReducer,
  findPassword: findPasswordReducer,
  course: courseReducer,
  homeCourse: homeCourseReducer,
  courseDetail: courseDetailReducer,
  search: searchReducer,
  myLecture: myLectureReducer,
  problem: problemReducer,
  [lectureApiSlice.reducerPath]: lectureApiSlice.reducer,
  [missionApiSlice.reducerPath]: missionApiSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PURGE",
          "persist/REGISTER",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/RESUME",
        ],
      },
    }).concat(
      authApiSlice.middleware,
      lectureApiSlice.middleware,
      missionApiSlice.middleware,
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
