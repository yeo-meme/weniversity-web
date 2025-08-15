import { configureStore } from "@reduxjs/toolkit";
import registerReducer from "./registerSlice";
import myPageReducer from "./myPageSlice";
import findPasswordReducer from "./findPasswordSlice";
import courseReducer from "./courseSlice";
import courseDetailReducer from "./courseDetailSlice";
import homeCourseReducer from "./homeCourseSlice";
import authReducer from "../auth/auth-slice";
import searchReducer from "./searchSlice";
import { authApiSlice } from "../auth/auth-api-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    authApi: authApiSlice.reducer,
    register: registerReducer,
    myPage: myPageReducer,
    findPassword: findPasswordReducer,
    course: courseReducer,
    homeCourse: homeCourseReducer,
    courseDetail: courseDetailReducer,
    search: searchReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(authApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
